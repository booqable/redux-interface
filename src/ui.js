'use strict'

import React, { Component } from 'react'
import { string, object, func } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect as reduxConnect } from 'react-redux'
import { updateUI, mountUI, unmountUI } from './reducer'
import cuid from 'cuid'

export default function decorate(key, opts = {}) {
  if (typeof key === 'object') {
    opts = key
    key = opts.key
  }

  function mapStateToProps(state, props) {
    const uiKey = [key, props.uiKey].join('')

    return {
      uiKey: uiKey,
      uiDefaults: opts.state || {},
      ui: state.interface.get(uiKey) || opts.state
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return bindActionCreators({
      updateUI,
      mountUI,
      unmountUI
    }, dispatch)
  }

  const connect = opts.connectWith || reduxConnect
  const connector = connect(mapStateToProps, mapDispatchToProps)

  return (WrappedComponent) => {
    class InterfaceComponent extends Component {
      static displayName = `ReduxInterface(${WrappedComponent.displayName})`

      static propTypes = {
        // State
        uiKey: string.isRequired,
        uiDefault: object,
        ui: object,
        // Dispatches
        updateUI: func.isRequired,
        mountUI: func.isRequired,
        unmountUI: func.isRequired
      }

      componentWillMount() {
        this.props.mountUI(this.props.uiKey, this.props.uiDefaults);
      }

      componentWillUnmount() {
        if (opts.persist !== true) {
          if (window && window.requestAnimationFrame) {
            window.requestAnimationFrame(() => this.props.unmountUI(this.props.uiKey))
          } else {
            this.props.unmountUI(this.props.uiKey)
          }
        }
      }

      updateUI(values) {
        return this.props.updateUI(this.props.uiKey, values)
      }

      render() {
        return (
          <WrappedComponent {...this.props} updateUI={this.updateUI.bind(this)} />
        )
      }
    }

    const ConnectedComponent = connector(InterfaceComponent)

    class ComponentWithKey extends Component {
      render() {
        this.uiKey = this.uiKey || this.props.uiKey || cuid()

        return (
          <ConnectedComponent uiKey={this.uiKey} {...this.props} />
        )
      }
    }

    return ComponentWithKey
  }
}
