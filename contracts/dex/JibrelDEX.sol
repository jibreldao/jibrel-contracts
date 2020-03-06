pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;

import './DEXTradingInterface.sol';
import '../crydr/controller/CrydrControllerBlockable/CrydrControllerBlockableInterface.sol';
import '../crydr/controller/CrydrControllerForcedTransfer/CrydrControllerForcedTransferInterface.sol';
import '../crydr/view/CrydrViewERC20/CrydrViewERC20Interface.sol';
import '../crydr/view/CrydrViewBase/CrydrViewBaseInterface.sol';


contract JibrelDEX is DEXTradingInterface{


  OrderData[] public orders;
  OrderTrade[] public trades;

  uint ordersCount = 0;
  uint tradesCount = 0;

  function removeOrderById(uint orderID) private {
      uint i = 0;
      while (orders[i].orderID != orderID) {
          i++;
      }

      while (i < orders.length - 1) {
          orders[i] = orders[i+1];
          i++;
      }
      orders.length--;
    }

  function listOrders() public view returns (OrderData[] memory){
    return orders;
  }

  function getOrderData(uint256 _orderID) public view returns (OrderData memory){
      return orders[_orderID];
  }

  function placeSellOrder(address _tradedAsset, uint256 _amountToSell, address _fiatAsset, uint256 _assetPrice, uint256 _expirationTimestamp) external returns (uint256){
    uint orderId = ordersCount;
    orders.push(
        OrderData({
            orderID: orderId,  // FIXME
            orderCreator: msg.sender,
            orderCreationTimestamp: block.timestamp,
            orderType: OrderType.Sell,
            tradedAssetAmount: _amountToSell,
            tradedAsset: _tradedAsset,
            fiatAsset: _fiatAsset,
            fiatPrice: _assetPrice,
            remainingTradedAssetAmount: _amountToSell,
            orderStatus: OrderStatus.Active,
            expirationTimestamp: _expirationTimestamp
        })
    );

    ordersCount += 1;

    require(CrydrViewERC20Interface(_tradedAsset).balanceOf(msg.sender) >= _amountToSell, "Not enough Asset Amount");

    address assetControllerAddress = CrydrViewBaseInterface(_tradedAsset).getCrydrController();
    CrydrControllerBlockableInterface(assetControllerAddress).blockAccountFunds(msg.sender, _amountToSell);

    emit OrderPlacedEvent(msg.sender,
                     orderId,
                     OrderType.Sell,
                     _tradedAsset,
                     _amountToSell,
                     _fiatAsset,
                     _assetPrice,
                     _expirationTimestamp );
    return orderId;
  }

  function placeBuyOrder(address _tradedAsset, uint256 _amountToBuy, address _fiatAsset, uint256 _assetPrice, uint256 _expirationTimestamp) external returns (uint256){
    uint orderId = ordersCount;
    orders.push(
        OrderData({
            orderID: orderId,  // FIXME
            orderCreator: msg.sender,
            orderCreationTimestamp: block.timestamp,
            orderType: OrderType.Buy,
            tradedAssetAmount: _amountToBuy,
            tradedAsset: _tradedAsset,
            fiatAsset: _fiatAsset,
            fiatPrice: _assetPrice,
            remainingTradedAssetAmount: _amountToBuy,
            orderStatus: OrderStatus.Active,
            expirationTimestamp: _expirationTimestamp
        })
    );

    ordersCount += 1;

    require(CrydrViewERC20Interface(_fiatAsset).balanceOf(msg.sender) >= _amountToBuy * _assetPrice, "Not enough Fiat Amount");

    address assetControllerAddress = CrydrViewBaseInterface(_fiatAsset).getCrydrController();
    CrydrControllerBlockableInterface(assetControllerAddress).blockAccountFunds(msg.sender, _amountToBuy * _assetPrice);

    emit OrderPlacedEvent(msg.sender,
                     orderId,
                     OrderType.Buy,
                     _tradedAsset,
                     _amountToBuy,
                     _fiatAsset,
                     _assetPrice,
                     _expirationTimestamp );
    return orderId;
  }

  function cancelOrder(uint256 _orderID) external {
    require(msg.sender == orders[_orderID].orderCreator, "Only creater can cancel Order");
    orders[_orderID].orderStatus = OrderStatus.Cancelled;

    address assetControllerAddress = CrydrViewBaseInterface(orders[_orderID].tradedAsset).getCrydrController();
    address fiatControllerAddress = CrydrViewBaseInterface(orders[_orderID].fiatAsset).getCrydrController();

    if(orders[_orderID].orderType == OrderType.Sell){
      CrydrControllerBlockableInterface(assetControllerAddress).unblockAccountFunds(orders[_orderID].orderCreator, orders[_orderID].remainingTradedAssetAmount);
    }else{
      CrydrControllerBlockableInterface(fiatControllerAddress).unblockAccountFunds(
        orders[_orderID].orderCreator, orders[_orderID].remainingTradedAssetAmount * orders[_orderID].fiatPrice);
    }

    emit OrderCancelledEvent(_orderID);
  }

  /* calculate how much fiat will be used to buy a particular amount of asset */
  function calculateAssetBuyAmount(uint256 _orderID, uint256 _tradedAssetAmount) public view returns (uint256){
    return orders[_orderID].fiatPrice * _tradedAssetAmount;
  }


  function getOrderTrades(uint _orderID) public view returns (OrderTrade[] memory){
    uint rescount = 0;
    uint i = 0;
    uint n = 0;
    while (i < trades.length) {
          if(trades[i].orderID == _orderID){
            rescount++;
          }
          i++;
    }
    OrderTrade[] memory res = new OrderTrade[](rescount);
    i = 0;

    while (i < trades.length) {
          if(trades[i].orderID == _orderID){
            res[n] = trades[i];
            n++;
          }
          i++;
    }

    return res;
  }


  function executeSellOrder(uint256 _orderID, uint256 _amountToBuy) external returns (uint256){
      //check availability
      OrderData memory order = orders[_orderID];  // FIXME!! memory??
      require(order.orderType == OrderType.Sell, "Sell order with requested ID not exists");
      uint256 fundsRequired = order.fiatPrice * _amountToBuy;

      require(msg.sender != order.orderCreator, "Could not execute order of yourself");
      require(order.remainingTradedAssetAmount >= _amountToBuy, "Not enough remained amount");
      require(order.orderStatus == OrderStatus.Active, "Order not Active");
      require(CrydrViewERC20Interface(order.fiatAsset).balanceOf(msg.sender) >= fundsRequired,
              "Not enough Fiat Amount");

      // crate Trade
      uint tradeId = tradesCount;
      OrderTrade memory trade = OrderTrade({
        tradeCreator: msg.sender,
        tradeCreationTimestamp: block.timestamp,
        tradeID: tradeId,
        orderID: _orderID,
        tradeAmount: _amountToBuy,
        tradeStatus: TradeStatus.Completed  // FIXME!!!
      });

      trades.push(trade);
      tradesCount++;

      // make exchange

      address assetControllerAddress = CrydrViewBaseInterface(order.tradedAsset).getCrydrController();
      address fiatControllerAddress = CrydrViewBaseInterface(order.fiatAsset).getCrydrController();

    // transfer fiats to seller
    //CrydrControllerBlockableInterface(fiatControllerAddress).unblockAccountFunds(msg.sender, fundsRequired);
      CrydrControllerForcedTransferInterface(fiatControllerAddress).forcedTransfer(msg.sender, order.orderCreator, fundsRequired);

      // transfer assets to buyer
      CrydrControllerBlockableInterface(assetControllerAddress).unblockAccountFunds(order.orderCreator, _amountToBuy);
      CrydrControllerForcedTransferInterface(assetControllerAddress).forcedTransfer(order.orderCreator, msg.sender, _amountToBuy);

      orders[_orderID].remainingTradedAssetAmount -= _amountToBuy;
      // emit events
      emit TradePlacedEvent(trade.tradeCreator, trade.tradeID, trade.orderID, trade.tradeAmount);
      emit TradeCompletedEvent(trade.tradeID);

      // check if we can complete order
      if (orders[_orderID].remainingTradedAssetAmount == 0){
        orders[_orderID].orderStatus = OrderStatus.Completed;
      }
  }

  function executeBuyOrder(uint256 _orderID, uint256 _amountToSell) external returns (uint256){
 //check availability
      OrderData memory order = orders[_orderID];  // FIXME!! memory??
      require(order.orderType == OrderType.Buy, "Buy order with requested ID not exists");
      uint256 fundsRequired = order.fiatPrice * _amountToSell;

      require(msg.sender != order.orderCreator, "Could not execute order of yourself");
      require(order.remainingTradedAssetAmount >= _amountToSell, "Not enough remained amount");
      require(order.orderStatus == OrderStatus.Active, "Order not Active");
      require(CrydrViewERC20Interface(order.tradedAsset).balanceOf(msg.sender) >= _amountToSell,
              "Not enough Asset Amount");

      // crate Trade
      uint tradeId = tradesCount;
      OrderTrade memory trade = OrderTrade({
        tradeCreator: msg.sender,
        tradeCreationTimestamp: block.timestamp,
        tradeID: tradeId,
        orderID: _orderID,
        tradeAmount: _amountToSell,
        tradeStatus: TradeStatus.Completed  // FIXME!!!
      });

      trades.push(trade);
      tradesCount++;

      // make exchange

      address assetControllerAddress = CrydrViewBaseInterface(order.tradedAsset).getCrydrController();
      address fiatControllerAddress = CrydrViewBaseInterface(order.fiatAsset).getCrydrController();

    // transfer fiats to seller
      CrydrControllerBlockableInterface(fiatControllerAddress).unblockAccountFunds(order.orderCreator, fundsRequired);
      CrydrControllerForcedTransferInterface(fiatControllerAddress).forcedTransfer(order.orderCreator, msg.sender, fundsRequired);

      // transfer assets to buyer
//      CrydrControllerBlockableInterface(assetControllerAddress).unblockAccountFunds(order.orderCreator, _amountToSell);
      CrydrControllerForcedTransferInterface(assetControllerAddress).forcedTransfer(msg.sender, order.orderCreator, _amountToSell);

      orders[_orderID].remainingTradedAssetAmount -= _amountToSell;
      // emit events
      emit TradePlacedEvent(trade.tradeCreator, trade.tradeID, trade.orderID, trade.tradeAmount);
      emit TradeCompletedEvent(trade.tradeID);

      // check if we can complete order
      if (orders[_orderID].remainingTradedAssetAmount == 0){
        orders[_orderID].orderStatus = OrderStatus.Completed;
      }
  }

  function cancelTrade(uint256 _tradeID) external {
      uint i = 0;
      while (trades[i].tradeID != _tradeID) {
          i++;
      }
      trades[i].tradeStatus = TradeStatus.Cancelled;
      emit TradeCancelledEvent(_tradeID);
  }
}