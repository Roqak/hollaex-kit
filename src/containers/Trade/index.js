import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { submitOrder } from '../../actions/orderAction';

import { TITLES, TEXTS } from './constants';

import TradeBlock from './components/TradeBlock';
import TradeBlockTabs from './components/TradeBlockTabs';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import TradeHistory from './components/TradeHistory';
import PriceChart from './components/PriceChart';

import { ActionNotification } from '../../components';

class Trade extends Component {
  state = {
    chartHeight: 0,
    chartWidth: 0,
  }

  onSubmitOrder = (values) => {
    return submitOrder(values)
      .then((body) => {
        console.log('sucess', body)
      })
      .then((error) => {
        console.log('error', error)
      });
  }

  setChartRef = (el) => {
    if (el) {
      this.chartBlock = el;
      this.onResize();
    }
  }

  goToTransactionsHistory = () => {
    this.props.router.push('transactions');
  }

  cancelAll = () => {

  }

  onResize = () => {
    if (this.chartBlock) {
      this.setState({
        chartHeight: this.chartBlock.offsetHeight || 0,
        chartWidth: this.chartBlock.offsetWidth || 0,
      });
    }
  }

  render() {
    const {
      tradeHistory,
      asks,
      bids,
      marketPrice,
      symbol,
      activeOrders,
      userTrades,
    } = this.props;
    const { chartHeight, chartWidth } = this.state
    const USER_TABS = [
      {
        title: TITLES.ORDERS,
        children: <ActiveOrders orders={activeOrders} />,
        titleAction: (
          <ActionNotification
            text={TEXTS.CANCEL_ALL}
            status="information"
            iconPath={ICONS.CHECK}
            onClick={this.cancelAll}
          />
        ),
      },
      {
        title: TITLES.TRADES,
        children: <UserTrades trades={userTrades} symbol={symbol} />,
        titleAction: (
          <ActionNotification
            text={TEXTS.TRADE_HISTORY}
            status="information"
            iconPath={ICONS.RED_ARROW}
            onClick={this.goToTransactionsHistory}
          />
        ),
      },
    ]

    return (
      <div className={classnames('trade-container', 'd-flex')}>
        <EventListener
          target="window"
          onResize={this.onResize}
        />
        <div className={classnames('trade-col_side_wrapper', 'flex-column', 'd-flex')}>
          <TradeBlock title={TITLES.ORDERBOOK}>
            <Orderbook
              symbol={symbol}
              asks={asks}
              bids={bids}
              marketPrice={marketPrice}
            />
          </TradeBlock>
        </div>
        <div className={classnames('trade-col_main_wrapper', 'flex-column', 'd-flex', 'flex-auto')}>
          <div className={classnames('trade-main_content', 'flex-auto', 'd-flex')}>
            <div className={classnames('trade-col_action_wrapper', 'flex-column', 'd-flex')}>
              <TradeBlock title={TITLES.ORDER_ENTRY}>
                <OrderEntry
                  submitOrder={this.onSubmitOrder}
                />
              </TradeBlock>
            </div>
            <TradeBlock title={TITLES.CHART} setRef={this.setChartRef}>
              {chartHeight > 0 &&
                <PriceChart
                  height={chartHeight}
                  width={chartWidth}
                />
              }
            </TradeBlock>
          </div>
          <div className={classnames('trade-tabs_content', 'd-flex', 'flex-column')}>
            <TradeBlockTabs content={USER_TABS} />
          </div>
        </div>
        <div className={classnames('trade-col_side_wrapper', 'flex-column', 'd-flex')}>
          <TradeBlock title={TITLES.TRADE_HISTORY}>
            <TradeHistory data={tradeHistory} />
          </TradeBlock>
        </div>
      </div>
    )
  }
}

Trade.defaultProps = {

}

const mapStateToProps = (store) => ({
  symbol: store.orderbook.symbol,
  tradeHistory: store.orderbook.trades,
  asks: store.orderbook.asks,
  bids: store.orderbook.bids,
  marketPrice: store.orderbook.price,
  activeOrders: store.order.activeOrders,
  userTrades: store.wallet.trades.data,
});

const mapDispatchToProps = (dispatch) => ({
  // submitOrder: bindActionCreators(submitOrder, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
