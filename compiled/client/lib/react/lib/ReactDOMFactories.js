/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMFactories
 * @typechecks static-only
 */

'use strict';

var ReactElement = require('./ReactElement');
var ReactElementValidator = require('./ReactElementValidator');

var mapObject = require('fbjs/lib/mapObject');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @param {string} tag Tag name (e.g. `div`).
 * @private
 */
function createDOMFactory(tag) {
  if (process.env.NODE_ENV !== 'production') {
    return ReactElementValidator.createFactory(tag);
  }
  return ReactElement.createFactory(tag);
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOMFactories = mapObject({
  a: 'a',
  abbr: 'abbr',
  address: 'address',
  area: 'area',
  article: 'article',
  aside: 'aside',
  audio: 'audio',
  b: 'b',
  base: 'base',
  bdi: 'bdi',
  bdo: 'bdo',
  big: 'big',
  blockquote: 'blockquote',
  body: 'body',
  br: 'br',
  button: 'button',
  canvas: 'canvas',
  caption: 'caption',
  cite: 'cite',
  code: 'code',
  col: 'col',
  colgroup: 'colgroup',
  data: 'data',
  datalist: 'datalist',
  dd: 'dd',
  del: 'del',
  details: 'details',
  dfn: 'dfn',
  dialog: 'dialog',
  div: 'div',
  dl: 'dl',
  dt: 'dt',
  em: 'em',
  embed: 'embed',
  fieldset: 'fieldset',
  figcaption: 'figcaption',
  figure: 'figure',
  footer: 'footer',
  form: 'form',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  head: 'head',
  header: 'header',
  hgroup: 'hgroup',
  hr: 'hr',
  html: 'html',
  i: 'i',
  iframe: 'iframe',
  img: 'img',
  input: 'input',
  ins: 'ins',
  kbd: 'kbd',
  keygen: 'keygen',
  label: 'label',
  legend: 'legend',
  li: 'li',
  link: 'link',
  main: 'main',
  map: 'map',
  mark: 'mark',
  menu: 'menu',
  menuitem: 'menuitem',
  meta: 'meta',
  meter: 'meter',
  nav: 'nav',
  noscript: 'noscript',
  object: 'object',
  ol: 'ol',
  optgroup: 'optgroup',
  option: 'option',
  output: 'output',
  p: 'p',
  param: 'param',
  picture: 'picture',
  pre: 'pre',
  progress: 'progress',
  q: 'q',
  rp: 'rp',
  rt: 'rt',
  ruby: 'ruby',
  s: 's',
  samp: 'samp',
  script: 'script',
  section: 'section',
  select: 'select',
  small: 'small',
  source: 'source',
  span: 'span',
  strong: 'strong',
  style: 'style',
  sub: 'sub',
  summary: 'summary',
  sup: 'sup',
  table: 'table',
  tbody: 'tbody',
  td: 'td',
  textarea: 'textarea',
  tfoot: 'tfoot',
  th: 'th',
  thead: 'thead',
  time: 'time',
  title: 'title',
  tr: 'tr',
  track: 'track',
  u: 'u',
  ul: 'ul',
  'var': 'var',
  video: 'video',
  wbr: 'wbr',

  // SVG
  circle: 'circle',
  clipPath: 'clipPath',
  defs: 'defs',
  ellipse: 'ellipse',
  g: 'g',
  image: 'image',
  line: 'line',
  linearGradient: 'linearGradient',
  mask: 'mask',
  path: 'path',
  pattern: 'pattern',
  polygon: 'polygon',
  polyline: 'polyline',
  radialGradient: 'radialGradient',
  rect: 'rect',
  stop: 'stop',
  svg: 'svg',
  text: 'text',
  tspan: 'tspan'

}, createDOMFactory);

module.exports = ReactDOMFactories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RE9NRmFjdG9yaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5CO0FBQ0EsSUFBSSx3QkFBd0IsUUFBUSx5QkFBUixDQUE1Qjs7QUFFQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjs7Ozs7Ozs7QUFRQSxTQUFTLGdCQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCLE1BQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxXQUFPLHNCQUFzQixhQUF0QixDQUFvQyxHQUFwQyxDQUFQO0FBQ0Q7QUFDRCxTQUFPLGFBQWEsYUFBYixDQUEyQixHQUEzQixDQUFQO0FBQ0Q7Ozs7Ozs7O0FBUUQsSUFBSSxvQkFBb0IsVUFBVTtBQUNoQyxLQUFHLEdBRDZCO0FBRWhDLFFBQU0sTUFGMEI7QUFHaEMsV0FBUyxTQUh1QjtBQUloQyxRQUFNLE1BSjBCO0FBS2hDLFdBQVMsU0FMdUI7QUFNaEMsU0FBTyxPQU55QjtBQU9oQyxTQUFPLE9BUHlCO0FBUWhDLEtBQUcsR0FSNkI7QUFTaEMsUUFBTSxNQVQwQjtBQVVoQyxPQUFLLEtBVjJCO0FBV2hDLE9BQUssS0FYMkI7QUFZaEMsT0FBSyxLQVoyQjtBQWFoQyxjQUFZLFlBYm9CO0FBY2hDLFFBQU0sTUFkMEI7QUFlaEMsTUFBSSxJQWY0QjtBQWdCaEMsVUFBUSxRQWhCd0I7QUFpQmhDLFVBQVEsUUFqQndCO0FBa0JoQyxXQUFTLFNBbEJ1QjtBQW1CaEMsUUFBTSxNQW5CMEI7QUFvQmhDLFFBQU0sTUFwQjBCO0FBcUJoQyxPQUFLLEtBckIyQjtBQXNCaEMsWUFBVSxVQXRCc0I7QUF1QmhDLFFBQU0sTUF2QjBCO0FBd0JoQyxZQUFVLFVBeEJzQjtBQXlCaEMsTUFBSSxJQXpCNEI7QUEwQmhDLE9BQUssS0ExQjJCO0FBMkJo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M0hnQjtBQTRIaEMsUUFBTSxNQTVIMEI7QUE2SGhDLFFBQU0sTUE3SDBCO0FBOEhoQyxXQUFTLFNBOUh1QjtBQStIaEMsV0FBUyxTQS9IdUI7QUFnSWhDLFlBQVUsVUFoSXNCO0FBaUloQyxrQkFBZ0IsZ0JBaklnQjtBQWtJaEMsUUFBTSxNQWxJMEI7QUFtSWhDLFFBQU0sTUFuSTBCO0FBb0loQyxPQUFLLEtBcEkyQjtBQXFJaEMsUUFBTSxNQXJJMEI7QUFzSWhDLFNBQU87O0FBdEl5QixDQUFWLEVBd0lyQixnQkF4SXFCLENBQXhCOztBQTBJQSxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6IlJlYWN0RE9NRmFjdG9yaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RE9NRmFjdG9yaWVzXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG52YXIgUmVhY3RFbGVtZW50VmFsaWRhdG9yID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnRWYWxpZGF0b3InKTtcblxudmFyIG1hcE9iamVjdCA9IHJlcXVpcmUoJ2ZianMvbGliL21hcE9iamVjdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIGZhY3RvcnkgdGhhdCBjcmVhdGVzIEhUTUwgdGFnIGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGFnIG5hbWUgKGUuZy4gYGRpdmApLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRE9NRmFjdG9yeSh0YWcpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICByZXR1cm4gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUZhY3RvcnkodGFnKTtcbiAgfVxuICByZXR1cm4gUmVhY3RFbGVtZW50LmNyZWF0ZUZhY3RvcnkodGFnKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwcGluZyBmcm9tIHN1cHBvcnRlZCBIVE1MIHRhZ3MgdG8gYFJlYWN0RE9NQ29tcG9uZW50YCBjbGFzc2VzLlxuICogVGhpcyBpcyBhbHNvIGFjY2Vzc2libGUgdmlhIGBSZWFjdC5ET01gLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xudmFyIFJlYWN0RE9NRmFjdG9yaWVzID0gbWFwT2JqZWN0KHtcbiAgYTogJ2EnLFxuICBhYmJyOiAnYWJicicsXG4gIGFkZHJlc3M6ICdhZGRyZXNzJyxcbiAgYXJlYTogJ2FyZWEnLFxuICBhcnRpY2xlOiAnYXJ0aWNsZScsXG4gIGFzaWRlOiAnYXNpZGUnLFxuICBhdWRpbzogJ2F1ZGlvJyxcbiAgYjogJ2InLFxuICBiYXNlOiAnYmFzZScsXG4gIGJkaTogJ2JkaScsXG4gIGJkbzogJ2JkbycsXG4gIGJpZzogJ2JpZycsXG4gIGJsb2NrcXVvdGU6ICdibG9ja3F1b3RlJyxcbiAgYm9keTogJ2JvZHknLFxuICBicjogJ2JyJyxcbiAgYnV0dG9uOiAnYnV0dG9uJyxcbiAgY2FudmFzOiAnY2FudmFzJyxcbiAgY2FwdGlvbjogJ2NhcHRpb24nLFxuICBjaXRlOiAnY2l0ZScsXG4gIGNvZGU6ICdjb2RlJyxcbiAgY29sOiAnY29sJyxcbiAgY29sZ3JvdXA6ICdjb2xncm91cCcsXG4gIGRhdGE6ICdkYXRhJyxcbiAgZGF0YWxpc3Q6ICdkYXRhbGlzdCcsXG4gIGRkOiAnZGQnLFxuICBkZWw6ICdkZWwnLFxuICBkZXRhaWxzOiAnZGV0YWlscycsXG4gIGRmbjogJ2RmbicsXG4gIGRpYWxvZzogJ2RpYWxvZycsXG4gIGRpdjogJ2RpdicsXG4gIGRsOiAnZGwnLFxuICBkdDogJ2R0JyxcbiAgZW06ICdlbScsXG4gIGVtYmVkOiAnZW1iZWQnLFxuICBmaWVsZHNldDogJ2ZpZWxkc2V0JyxcbiAgZmlnY2FwdGlvbjogJ2ZpZ2NhcHRpb24nLFxuICBmaWd1cmU6ICdmaWd1cmUnLFxuICBmb290ZXI6ICdmb290ZXInLFxuICBmb3JtOiAnZm9ybScsXG4gIGgxOiAnaDEnLFxuICBoMjogJ2gyJyxcbiAgaDM6ICdoMycsXG4gIGg0OiAnaDQnLFxuICBoNTogJ2g1JyxcbiAgaDY6ICdoNicsXG4gIGhlYWQ6ICdoZWFkJyxcbiAgaGVhZGVyOiAnaGVhZGVyJyxcbiAgaGdyb3VwOiAnaGdyb3VwJyxcbiAgaHI6ICdocicsXG4gIGh0bWw6ICdodG1sJyxcbiAgaTogJ2knLFxuICBpZnJhbWU6ICdpZnJhbWUnLFxuICBpbWc6ICdpbWcnLFxuICBpbnB1dDogJ2lucHV0JyxcbiAgaW5zOiAnaW5zJyxcbiAga2JkOiAna2JkJyxcbiAga2V5Z2VuOiAna2V5Z2VuJyxcbiAgbGFiZWw6ICdsYWJlbCcsXG4gIGxlZ2VuZDogJ2xlZ2VuZCcsXG4gIGxpOiAnbGknLFxuICBsaW5rOiAnbGluaycsXG4gIG1haW46ICdtYWluJyxcbiAgbWFwOiAnbWFwJyxcbiAgbWFyazogJ21hcmsnLFxuICBtZW51OiAnbWVudScsXG4gIG1lbnVpdGVtOiAnbWVudWl0ZW0nLFxuICBtZXRhOiAnbWV0YScsXG4gIG1ldGVyOiAnbWV0ZXInLFxuICBuYXY6ICduYXYnLFxuICBub3NjcmlwdDogJ25vc2NyaXB0JyxcbiAgb2JqZWN0OiAnb2JqZWN0JyxcbiAgb2w6ICdvbCcsXG4gIG9wdGdyb3VwOiAnb3B0Z3JvdXAnLFxuICBvcHRpb246ICdvcHRpb24nLFxuICBvdXRwdXQ6ICdvdXRwdXQnLFxuICBwOiAncCcsXG4gIHBhcmFtOiAncGFyYW0nLFxuICBwaWN0dXJlOiAncGljdHVyZScsXG4gIHByZTogJ3ByZScsXG4gIHByb2dyZXNzOiAncHJvZ3Jlc3MnLFxuICBxOiAncScsXG4gIHJwOiAncnAnLFxuICBydDogJ3J0JyxcbiAgcnVieTogJ3J1YnknLFxuICBzOiAncycsXG4gIHNhbXA6ICdzYW1wJyxcbiAgc2NyaXB0OiAnc2NyaXB0JyxcbiAgc2VjdGlvbjogJ3NlY3Rpb24nLFxuICBzZWxlY3Q6ICdzZWxlY3QnLFxuICBzbWFsbDogJ3NtYWxsJyxcbiAgc291cmNlOiAnc291cmNlJyxcbiAgc3BhbjogJ3NwYW4nLFxuICBzdHJvbmc6ICdzdHJvbmcnLFxuICBzdHlsZTogJ3N0eWxlJyxcbiAgc3ViOiAnc3ViJyxcbiAgc3VtbWFyeTogJ3N1bW1hcnknLFxuICBzdXA6ICdzdXAnLFxuICB0YWJsZTogJ3RhYmxlJyxcbiAgdGJvZHk6ICd0Ym9keScsXG4gIHRkOiAndGQnLFxuICB0ZXh0YXJlYTogJ3RleHRhcmVhJyxcbiAgdGZvb3Q6ICd0Zm9vdCcsXG4gIHRoOiAndGgnLFxuICB0aGVhZDogJ3RoZWFkJyxcbiAgdGltZTogJ3RpbWUnLFxuICB0aXRsZTogJ3RpdGxlJyxcbiAgdHI6ICd0cicsXG4gIHRyYWNrOiAndHJhY2snLFxuICB1OiAndScsXG4gIHVsOiAndWwnLFxuICAndmFyJzogJ3ZhcicsXG4gIHZpZGVvOiAndmlkZW8nLFxuICB3YnI6ICd3YnInLFxuXG4gIC8vIFNWR1xuICBjaXJjbGU6ICdjaXJjbGUnLFxuICBjbGlwUGF0aDogJ2NsaXBQYXRoJyxcbiAgZGVmczogJ2RlZnMnLFxuICBlbGxpcHNlOiAnZWxsaXBzZScsXG4gIGc6ICdnJyxcbiAgaW1hZ2U6ICdpbWFnZScsXG4gIGxpbmU6ICdsaW5lJyxcbiAgbGluZWFyR3JhZGllbnQ6ICdsaW5lYXJHcmFkaWVudCcsXG4gIG1hc2s6ICdtYXNrJyxcbiAgcGF0aDogJ3BhdGgnLFxuICBwYXR0ZXJuOiAncGF0dGVybicsXG4gIHBvbHlnb246ICdwb2x5Z29uJyxcbiAgcG9seWxpbmU6ICdwb2x5bGluZScsXG4gIHJhZGlhbEdyYWRpZW50OiAncmFkaWFsR3JhZGllbnQnLFxuICByZWN0OiAncmVjdCcsXG4gIHN0b3A6ICdzdG9wJyxcbiAgc3ZnOiAnc3ZnJyxcbiAgdGV4dDogJ3RleHQnLFxuICB0c3BhbjogJ3RzcGFuJ1xuXG59LCBjcmVhdGVET01GYWN0b3J5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdERPTUZhY3RvcmllczsiXX0=