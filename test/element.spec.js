import * as PIXI from 'pixi.js'
import DisplayObject from '../src/components/DisplayObject'
import { createElement, TYPES, TYPES_INJECTED, PixiComponent } from '../src/utils/element'

import { emptyTexture } from './__fixtures__/textures'
import { desyrel } from './__fixtures__/bitmapfonts'
import parseBitmapFont from './__utils__/parseBitmapFont'

parseBitmapFont(desyrel)

describe('createElement', () => {
  test('types', () => {
    expect(TYPES).toMatchSnapshot()
  })

  test('create Container', () => {
    const element = createElement(TYPES.Container)
    expect(element).toBeInstanceOf(PIXI.Container)
  })

  test('create Text', () => {
    const element = createElement(TYPES.Text, { text: 'foobar' })
    expect(element).toBeInstanceOf(PIXI.Text)
  })

   test('create Text as a sprite', () => {
    const element = createElement(TYPES.Text, { text: 'foobar', isSprite: true })
    expect(element).toBeInstanceOf(PIXI.Sprite)
  })

  test('create Sprite', () => {
    const element = createElement(TYPES.Sprite, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.Sprite)
  })

  test('create AnimatedSprite', () => {
    const element = createElement(TYPES.AnimatedSprite, { textures: [emptyTexture] })
    expect(element).toBeInstanceOf(PIXI.AnimatedSprite)
  })

  test('create ParticleContainer', () => {
    const element = createElement(TYPES.ParticleContainer)
    expect(element).toBeInstanceOf(PIXI.ParticleContainer)
  })

  test('create BitmapText', () => {
    const element = createElement(TYPES.BitmapText, { text: 'foobar', style: { font: '35px Desyrel' } })
    expect(element).toBeInstanceOf(PIXI.BitmapText)
  })

  test('create TilingSprite', () => {
    const element = createElement(TYPES.TilingSprite, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.TilingSprite)
  })

  test('create Graphics', () => {
    const element = createElement(TYPES.Graphics)
    expect(element).toBeInstanceOf(PIXI.Graphics)
  })

  test('create NineSlicePlane', () => {
    const element = createElement(TYPES.NineSlicePlane, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.NineSlicePlane)
  })

  test('create SimpleMesh', () => {
    const element = createElement(TYPES.SimpleMesh, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.SimpleMesh)
  })

  test('create SimpleRope', () => {
    const element = createElement(
      TYPES.SimpleRope,
      {
        texture: emptyTexture,
        points: [
          new PIXI.Point(0, 0),
          new PIXI.Point(20, 20),
        ],
      },
    )
    expect(element).toBeInstanceOf(PIXI.SimpleRope)
  })

  test('get undefined', () => {
    expect(createElement('INVALID')).toBeUndefined()
  })
})

describe('element.reactApplyProps', () => {
  let spy

  beforeAll(() => {
    spy = jest.spyOn(PIXI.Texture, 'from').mockReturnValue(emptyTexture)
  })

  afterAll(() => {
    spy.mockRestore()
  })

  test('Sprite.reactApplyProps exists', () => {
    const element = createElement(TYPES.Sprite, { image: './image.png' })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).toHaveBeenCalledWith('./image.png')
  })

  test('AnimatedSprite.reactApplyProps with images prop exists', () => {
    const element = createElement(TYPES.AnimatedSprite, { images: ['./image.png'] })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).lastCalledWith('./image.png')
  })

  test('AnimatedSprite.reactApplyProps with textures prop exists', () => {
    const element = createElement(TYPES.AnimatedSprite, { textures: [PIXI.Texture.from('./image.png')] })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).lastCalledWith('./image.png')
  })

  test('Sprite.reactApplyProps image', () => {
    const element = createElement(TYPES.Sprite, { image: './image.png' })
    expect(spy).lastCalledWith('./image.png')

    element.reactApplyProps({ image: './image.png' }, { image: './new-image.png' })
    expect(spy).lastCalledWith('./new-image.png')
  })

  test('TilingSprite.reactApplyProps exists', () => {
    const element = createElement(TYPES.TilingSprite, { image: './image.png' })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).toHaveBeenCalledWith('./image.png')
  })

  test('TilingSprite.reactApplyProps image', () => {
    const element = createElement(TYPES.TilingSprite, { image: './image.png' })
    expect(spy).lastCalledWith('./image.png')

    element.reactApplyProps({ image: './image.png' }, { image: './new-image.png' })
    expect(spy).lastCalledWith('./new-image.png')
  })

  test('SimpleRope.reactApplyProps exists', () => {
    const element = createElement(
      TYPES.SimpleRope,
      {
        image: './image.png',
        points: [
          new PIXI.Point(0, 0),
          new PIXI.Point(20, 20),
        ],
      },
    )
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).toHaveBeenCalledWith('./image.png')
  })

  test('SimpleRope.reactApplyProps image', () => {
    const element = createElement(
      TYPES.SimpleRope,
      {
        image: './image.png',
        points: [
          new PIXI.Point(0, 0),
          new PIXI.Point(20, 20),
        ],
      },
    )
    expect(spy).lastCalledWith('./image.png')

    element.reactApplyProps(
      { image: './image.png' },
      {
        image: './new-image.png',
        points: [
          new PIXI.Point(0, 0),
          new PIXI.Point(20, 20),
        ],
      },
    )
    expect(spy).lastCalledWith('./new-image.png')
  })

  test('NineSlicePlane.reactApplyProps exists', () => {
    const element = createElement(TYPES.NineSlicePlane, { image: './image.png' })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).toHaveBeenCalledWith('./image.png')
  })

  test('NineSlicePlane.reactApplyProps image', () => {
    const element = createElement(TYPES.NineSlicePlane, { image: './image.png' })
    expect(spy).lastCalledWith('./image.png')

    element.reactApplyProps({ image: './image.png' }, { image: './new-image.png' })
    expect(spy).lastCalledWith('./new-image.png')
  })

  test('SimpleMesh.reactApplyProps exists', () => {
    const element = createElement(TYPES.SimpleMesh, { image: './image.png' })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).toHaveBeenCalledWith('./image.png')
  })

  test('SimpleMesh.reactApplyProps image', () => {
    const element = createElement(TYPES.SimpleMesh, { image: './image.png' })
    expect(spy).lastCalledWith('./image.png')

    element.reactApplyProps({ image: './image.png' }, { image: './new-image.png' })
    expect(spy).lastCalledWith('./new-image.png')
  })

  test('Graphics.reactApplyProps exists', () => {
    const spy = jest.fn()

    const element = createElement(TYPES.Graphics, { draw: spy })
    expect(element.__proto__).toHaveProperty('reactApplyProps')
    expect(spy).toBeCalledWith(element)
  })

  test('Graphics.reactApplyProps draw', () => {
    const spy = jest.fn()

    const element = createElement(TYPES.Graphics, { draw: spy })
    expect(spy).toHaveBeenCalledTimes(1)

    element.reactApplyProps({ draw: spy }, { draw: spy })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Graphics.applyProps draw prevented twice', () => {
    const draw1 = jest.fn()
    const draw2 = jest.fn()
    const props = { draw: draw1 }
    const nextProps = { draw: draw2 }
    const element = createElement(TYPES.Graphics, props)
    element.reactApplyProps(props, props)
    element.reactApplyProps(props, props)
    expect(draw1).toHaveBeenCalledTimes(1)
    element.reactApplyProps(props, nextProps)
    element.reactApplyProps(nextProps, nextProps)
    expect(draw2).toHaveBeenCalledTimes(1)
  })


})

describe('PixiComponent', () => {
  afterEach(() => {
    Object.keys(TYPES_INJECTED).forEach(k => {
      delete TYPES_INJECTED[k]
    })
  })

  test('type must be defined', () => {
    expect(() => new PixiComponent(null)).toThrow('Expect type to be defined, got `null`')
  })

  test('cannot override existing component', () => {
    expect(() => new PixiComponent('Text', {})).toThrow(
      'Component `Text` could not be created, already exists in default components.'
    )
  })

  test('inject custom component', () => {
    let lifecycle = { create: props => {} }
    new PixiComponent('Rectangle', lifecycle)
    expect(TYPES_INJECTED).toHaveProperty('Rectangle', lifecycle)
  })

  test('create injected component', () => {
    const scoped = jest.fn()

    const lifecycle = {
      create: jest.fn(() => new PIXI.Graphics()),
      didMount: jest.fn(),
      willUnmount: jest.fn(),
    }

    const spy = jest.spyOn(DisplayObject.prototype, 'reactApplyProps').mockImplementation(function() {
      scoped(this)
    })

    new PixiComponent('Rectangle', lifecycle)

    const props = { x: 100, y: 200 }
    const element = createElement('Rectangle', props)

    expect(element.didMount).toBeDefined()
    expect(element.willUnmount).toBeDefined()
    expect(element.reactApplyProps).toBeDefined()
    expect(element).toBeInstanceOf(PIXI.Graphics)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(lifecycle.create).toHaveBeenCalledTimes(1)
    expect(lifecycle.create).toHaveBeenCalledWith(props)
    expect(scoped).toHaveBeenCalledTimes(1)
    expect(scoped).toHaveBeenCalledWith(element)
  })

  test('create injected component without lifecycle methods', () => {
    new PixiComponent('Rectangle', {
      create: () => new PIXI.Graphics(),
    })

    const element = createElement('Rectangle')
    expect(element.didMount).toBeUndefined()
    expect(element.willUnmount).toBeUndefined()
    expect(element.reactApplyProps).toBeDefined()
  })
})
