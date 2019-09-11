import React, { Component } from 'react';
import classnames from 'classnames';
import UserList from './userList';
import TradingVolume from './tradingVolume';
import { Table, Spin, Alert, Row, Col } from 'antd';
import { checkRole, getEmail } from '../../../utils';

import './index.css';

class Main extends Component {
	state = {
		userListLoading: true,
		tradingVolumeLoading: true,
		pageDisplay: 'none',
		loaded: true
	};
	componentWillMount() {
	}
	setUserListLoading = (userListLoading) => {
		this.setState({ userListLoading });
	};
	setTradingVolumeLoading = (tradingVolumeLoading) => {
		this.setState({ tradingVolumeLoading });
	};

	render() {
		const {
			userListLoading,
			tradingVolumeLoading,
			pageDisplay,
			loaded
		} = this.state;
		return (
			<div className="app_container-content">
				<div className="page" style={{ display: pageDisplay }}>
					<h1 className="black-header">
						<div className="black-text">DASHBOARD</div>
					</h1>
					<Row>
						<Col span={8}>
							<p>Welcome {getEmail()}</p>
						</Col>
						<Col span={8}>
							<p>Role: {checkRole()}</p>
						</Col>
					</Row>
					<div className="main-header">
						<UserList
							setUserListLoading={() => this.setUserListLoading(false)}
						/>
					</div>
					<TradingVolume />
				</div>
				{userListLoading ? (
					<Spin size="large" className="m-top" />
				) : loaded ? (
					this.setState({ pageDisplay: 'block', loaded: false })
				) : (
							<div />
						)}
			</div>
		);
	}
}

export default Main;