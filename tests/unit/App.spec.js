import { mount } from '@vue/test-utils'
import CadViewerApp from '../../src/App.vue'

describe('CadViewerApp', () => {
  test('renders component', () => {
    const wrapper = mount(CadViewerApp)
    expect(wrapper.find('.cad-viewer-app').exists()).toBe(true)
    expect(wrapper.find('.viewer-header').exists()).toBe(true)
    expect(wrapper.find('#cad-viewer').exists()).toBe(true)
  })

  test('displays default title when no file name', () => {
    const wrapper = mount(CadViewerApp)
    expect(wrapper.find('h2').text()).toBe('CAD Viewer')
  })

  test('has toolbar buttons', () => {
    const wrapper = mount(CadViewerApp)
    const buttons = wrapper.findAll('.toolbar .btn')
    expect(buttons.length).toBe(2)
  })
})
