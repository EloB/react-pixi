/**
 * -------------------------------------------
 * Host Config file.
 *
 * See:
 *   https://github.com/facebook/react/tree/master/packages/react-reconciler
 *   https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js
 * -------------------------------------------
 */

import invariant from 'fbjs/lib/invariant'
import performanceNow from 'performance-now'

import DisplayObject from '../components/DisplayObject'
import { createElement } from '../utils/element'
import { CHILDREN } from '../utils/props'

function appendChild(parent, child) {
  if (parent.addChild) {
    parent.addChild(child)

    if (typeof child.didMount === 'function') {
      child.didMount.call(child, child, parent)
    }
  }
}

function removeChild(parent, child) {
  if (typeof child.willUnmount === 'function') {
    child.willUnmount.call(child, child, parent)
  }

  parent.removeChild(child)
  child.destroy()
}

function insertBefore(parent, child, beforeChild) {
  invariant(child !== beforeChild, 'react-pixi: PixiFiber cannot insert node before itself')

  const childExists = parent.children.indexOf(child) !== -1
  const index = parent.getChildIndex(beforeChild)

  childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index)
}

// get diff between 2 objects
// https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
function diffProperties(pixiElement, type, lastProps, nextProps, rootContainerElement) {
  let updatePayload = null

  for (let propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      if (!updatePayload) {
        updatePayload = []
      }
      updatePayload.push(propKey, null)
    }
  }

  for (let propKey in nextProps) {
    const nextProp = nextProps[propKey]
    const lastProp = lastProps != null ? lastProps[propKey] : undefined

    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
      continue
    }

    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      if (!updatePayload) {
        updatePayload = []
      }
      updatePayload.push(propKey, nextProp)
    }
  }
  return updatePayload
}

const HostConfig = (eventsMap = {}) => {
  const callEvent = (event, ...value) => {
    if (eventsMap[event]) {
      eventsMap[event](...value)
    }
  }

  return {
    getRootHostContext(rootContainerInstance) {
      callEvent('getRootHostContext', rootContainerInstance)
      return rootContainerInstance
    },

    getChildHostContext() {
      callEvent('getChildHostContext', {})
      return {}
    },

    getChildHostContextForEventComponent(parentHostContext) {
      callEvent('getChildHostContextForEventComponent', parentHostContext)
      return parentHostContext
    },

    getPublicInstance(instance) {
      callEvent('getPublicInstance', instance)
      return instance
    },

    prepareForCommit() {
      callEvent('prepareForCommit')
      // noop
    },

    resetAfterCommit() {
      callEvent('resetAfterCommit')
      // noop
    },

    createInstance(...args) {
      const result = createElement.apply(null, args)
      callEvent('createInstance', result)
      return result
    },

    hideInstance(instance) {
      instance.visible = false
      callEvent('hideInstance', false)
    },

    unhideInstance(instance, props) {
      const visible = props !== undefined && props !== null && props.hasOwnProperty('visible') ? props.visible : true
      instance.visible = visible

      callEvent('unhideInstance', visible)
    },

    appendInitialChild(...args) {
      const result = appendChild.apply(null, args)
      callEvent('appendInitialChild', result)
      return result
    },

    finalizeInitialChildren(wordElement, type, props) {
      callEvent('finalizeInitialChildren', false)
      return false
    },

    prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
      const result = diffProperties(pixiElement, type, oldProps, newProps, rootContainerInstance)
      callEvent('prepareUpdate', result)
      return result
    },

    shouldSetTextContent(type, props) {
      callEvent('shouldSetTextContent', false)
      return false
    },

    shouldDeprioritizeSubtree(type, props) {
      const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0
      const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true
      const isVisible = typeof props.visible === 'undefined' || props.visible === true

      const result = !(isAlphaVisible && isRenderable && isVisible)
      callEvent('shouldDeprioritizeSubtree', result)
      return result
    },

    createTextInstance(text, rootContainerInstance, internalInstanceHandler) {
      invariant(
        false,
        'react-pixi: PixiFiber does not support text nodes as children of a Pixi component. ' +
          'To pass a string value to your component, use a property other than children. ' +
          'If you wish to display some text, you can use &lt;Text text={string} /&gt; instead.'
      )
      callEvent('createTextInstance')
    },

    mountEventComponent() {
      callEvent('mountEventComponent')
      // noop
    },

    updateEventComponent() {
      callEvent('updateEventComponent')
      // noop
    },

    handleEventTarget() {
      callEvent('handleEventTarget')
      // noop
    },

    scheduleTimeout: (...args) => {
      callEvent('scheduleTimeout')
      return setTimeout.apply(null, args)
    },

    cancelTimeout: (...args) => {
      callEvent('cancelTimeout')
      return clearTimeout.apply(null, args)
    },

    noTimeout: -1,

    warnsIfNotActing: false,

    now: performanceNow,

    isPrimaryRenderer: false,

    supportsMutation: true,

    supportsPersistence: false,

    supportsHydration: false,

    /**
     * -------------------------------------------
     * Mutation
     * -------------------------------------------
     */

    appendChild(...args) {
      callEvent('appendChild', ...args)
      return appendChild.apply(null, args)
    },

    appendChildToContainer(...args) {
      callEvent('appendChildToContainer', ...args)
      return appendChild.apply(null, args)
    },

    removeChild(...args) {
      callEvent('removeChild', ...args)
      return removeChild.apply(null, args)
    },

    removeChildFromContainer(...args) {
      callEvent('removeChildFromContainer', ...args)
      return removeChild.apply(null, args)
    },

    insertBefore(...args) {
      callEvent('insertBefore', ...args)
      return insertBefore.apply(null, args)
    },

    insertInContainerBefore(...args) {
      callEvent('insertInContainerBefore', ...args)
      return insertBefore.apply(null, args)
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      instance.reactApplyProps(oldProps, newProps)
      callEvent('commitUpdate')
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      callEvent('commitMount')
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      callEvent('commitTextUpdate')
      // noop
    },

    resetTextContent(pixiElement) {
      callEvent('resetTextContent', pixiElement)
      // noop
    },
  }
}

export default HostConfig
