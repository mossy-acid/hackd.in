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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RE9NRmFjdG9yaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQWY7QUFDSixJQUFJLHdCQUF3QixRQUFRLHlCQUFSLENBQXhCOztBQUVKLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQVo7Ozs7Ozs7O0FBUUosU0FBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQjtBQUM3QixNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7QUFDekMsV0FBTyxzQkFBc0IsYUFBdEIsQ0FBb0MsR0FBcEMsQ0FBUCxDQUR5QztHQUEzQztBQUdBLFNBQU8sYUFBYSxhQUFiLENBQTJCLEdBQTNCLENBQVAsQ0FKNkI7Q0FBL0I7Ozs7Ozs7O0FBYUEsSUFBSSxvQkFBb0IsVUFBVTtBQUNoQyxLQUFHLEdBQUg7QUFDQSxRQUFNLE1BQU47QUFDQSxXQUFTLFNBQVQ7QUFDQSxRQUFNLE1BQU47QUFDQSxXQUFTLFNBQVQ7QUFDQSxTQUFPLE9BQVA7QUFDQSxTQUFPLE9BQVA7QUFDQSxLQUFHLEdBQUg7QUFDQSxRQUFNLE1BQU47QUFDQSxPQUFLLEtBQUw7QUFDQSxPQUFLLEtBQUw7QUFDQSxPQUFLLEtBQUw7QUFDQSxjQUFZLFlBQVo7QUFDQSxRQUFNLE1BQU47QUFDQSxNQUFJLElBQUo7QUFDQSxVQUFRLFFBQVI7QUFDQSxVQUFRLFFBQVI7QUFDQSxXQUFTLFNBQVQ7QUFDQSxRQUFNLE1BQU47QUFDQSxRQUFNLE1BQU47QUFDQSxPQUFLLEtBQUw7QUFDQSxZQUFVLFVBQVY7QUFDQSxRQUFNLE1BQU47QUFDQSxZQUFVLFVBQVY7QUFDQSxNQUFJLElBQUo7QUFDQSxPQUFLLEtBQUw7QUFDQSxXQUFTLFNBQVQ7QUFDQSxPQUFLLEtBQUw7QUFDQSxVQUFRLFFBQVI7QUFDQSxPQUFLLEtBQUw7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxTQUFPLE9BQVA7QUFDQSxZQUFVLFVBQVY7QUFDQSxjQUFZLFlBQVo7QUFDQSxVQUFRLFFBQVI7QUFDQSxVQUFRLFFBQVI7QUFDQSxRQUFNLE1BQU47QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxRQUFNLE1BQU47QUFDQSxVQUFRLFFBQVI7QUFDQSxVQUFRLFFBQVI7QUFDQSxNQUFJLElBQUo7QUFDQSxRQUFNLE1BQU47QUFDQSxLQUFHLEdBQUg7QUFDQSxVQUFRLFFBQVI7QUFDQSxPQUFLLEtBQUw7QUFDQSxTQUFPLE9BQVA7QUFDQSxPQUFLLEtBQUw7QUFDQSxPQUFLLEtBQUw7QUFDQSxVQUFRLFFBQVI7QUFDQSxTQUFPLE9BQVA7QUFDQSxVQUFRLFFBQVI7QUFDQSxNQUFJLElBQUo7QUFDQSxRQUFNLE1BQU47QUFDQSxRQUFNLE1BQU47QUFDQSxPQUFLLEtBQUw7QUFDQSxRQUFNLE1BQU47QUFDQSxRQUFNLE1BQU47QUFDQSxZQUFVLFVBQVY7QUFDQSxRQUFNLE1BQU47QUFDQSxTQUFPLE9BQVA7QUFDQSxPQUFLLEtBQUw7QUFDQSxZQUFVLFVBQVY7QUFDQSxVQUFRLFFBQVI7QUFDQSxNQUFJLElBQUo7QUFDQSxZQUFVLFVBQVY7QUFDQSxVQUFRLFFBQVI7QUFDQSxVQUFRLFFBQVI7QUFDQSxLQUFHLEdBQUg7QUFDQSxTQUFPLE9BQVA7QUFDQSxXQUFTLFNBQVQ7QUFDQSxPQUFLLEtBQUw7QUFDQSxZQUFVLFVBQVY7QUFDQSxLQUFHLEdBQUg7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxRQUFNLE1BQU47QUFDQSxLQUFHLEdBQUg7QUFDQSxRQUFNLE1BQU47QUFDQSxVQUFRLFFBQVI7QUFDQSxXQUFTLFNBQVQ7QUFDQSxVQUFRLFFBQVI7QUFDQSxTQUFPLE9BQVA7QUFDQSxVQUFRLFFBQVI7QUFDQSxRQUFNLE1BQU47QUFDQSxVQUFRLFFBQVI7QUFDQSxTQUFPLE9BQVA7QUFDQSxPQUFLLEtBQUw7QUFDQSxXQUFTLFNBQVQ7QUFDQSxPQUFLLEtBQUw7QUFDQSxTQUFPLE9BQVA7QUFDQSxTQUFPLE9BQVA7QUFDQSxNQUFJLElBQUo7QUFDQSxZQUFVLFVBQVY7QUFDQSxTQUFPLE9BQVA7QUFDQSxNQUFJLElBQUo7QUFDQSxTQUFPLE9BQVA7QUFDQSxRQUFNLE1BQU47QUFDQSxTQUFPLE9BQVA7QUFDQSxNQUFJLElBQUo7QUFDQSxTQUFPLE9BQVA7QUFDQSxLQUFHLEdBQUg7QUFDQSxNQUFJLElBQUo7QUFDQSxTQUFPLEtBQVA7QUFDQSxTQUFPLE9BQVA7QUFDQSxPQUFLLEtBQUw7OztBQUdBLFVBQVEsUUFBUjtBQUNBLFlBQVUsVUFBVjtBQUNBLFFBQU0sTUFBTjtBQUNBLFdBQVMsU0FBVDtBQUNBLEtBQUcsR0FBSDtBQUNBLFNBQU8sT0FBUDtBQUNBLFFBQU0sTUFBTjtBQUNBLGtCQUFnQixnQkFBaEI7QUFDQSxRQUFNLE1BQU47QUFDQSxRQUFNLE1BQU47QUFDQSxXQUFTLFNBQVQ7QUFDQSxXQUFTLFNBQVQ7QUFDQSxZQUFVLFVBQVY7QUFDQSxrQkFBZ0IsZ0JBQWhCO0FBQ0EsUUFBTSxNQUFOO0FBQ0EsUUFBTSxNQUFOO0FBQ0EsT0FBSyxLQUFMO0FBQ0EsUUFBTSxNQUFOO0FBQ0EsU0FBTyxPQUFQOztDQXRJc0IsRUF3SXJCLGdCQXhJcUIsQ0FBcEI7O0FBMElKLE9BQU8sT0FBUCxHQUFpQixpQkFBakIiLCJmaWxlIjoiUmVhY3RET01GYWN0b3JpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RET01GYWN0b3JpZXNcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcbnZhciBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudFZhbGlkYXRvcicpO1xuXG52YXIgbWFwT2JqZWN0ID0gcmVxdWlyZSgnZmJqcy9saWIvbWFwT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgZmFjdG9yeSB0aGF0IGNyZWF0ZXMgSFRNTCB0YWcgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUYWcgbmFtZSAoZS5nLiBgZGl2YCkuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVET01GYWN0b3J5KHRhZykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHJldHVybiBSZWFjdEVsZW1lbnRWYWxpZGF0b3IuY3JlYXRlRmFjdG9yeSh0YWcpO1xuICB9XG4gIHJldHVybiBSZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeSh0YWcpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXBwaW5nIGZyb20gc3VwcG9ydGVkIEhUTUwgdGFncyB0byBgUmVhY3RET01Db21wb25lbnRgIGNsYXNzZXMuXG4gKiBUaGlzIGlzIGFsc28gYWNjZXNzaWJsZSB2aWEgYFJlYWN0LkRPTWAuXG4gKlxuICogQHB1YmxpY1xuICovXG52YXIgUmVhY3RET01GYWN0b3JpZXMgPSBtYXBPYmplY3Qoe1xuICBhOiAnYScsXG4gIGFiYnI6ICdhYmJyJyxcbiAgYWRkcmVzczogJ2FkZHJlc3MnLFxuICBhcmVhOiAnYXJlYScsXG4gIGFydGljbGU6ICdhcnRpY2xlJyxcbiAgYXNpZGU6ICdhc2lkZScsXG4gIGF1ZGlvOiAnYXVkaW8nLFxuICBiOiAnYicsXG4gIGJhc2U6ICdiYXNlJyxcbiAgYmRpOiAnYmRpJyxcbiAgYmRvOiAnYmRvJyxcbiAgYmlnOiAnYmlnJyxcbiAgYmxvY2txdW90ZTogJ2Jsb2NrcXVvdGUnLFxuICBib2R5OiAnYm9keScsXG4gIGJyOiAnYnInLFxuICBidXR0b246ICdidXR0b24nLFxuICBjYW52YXM6ICdjYW52YXMnLFxuICBjYXB0aW9uOiAnY2FwdGlvbicsXG4gIGNpdGU6ICdjaXRlJyxcbiAgY29kZTogJ2NvZGUnLFxuICBjb2w6ICdjb2wnLFxuICBjb2xncm91cDogJ2NvbGdyb3VwJyxcbiAgZGF0YTogJ2RhdGEnLFxuICBkYXRhbGlzdDogJ2RhdGFsaXN0JyxcbiAgZGQ6ICdkZCcsXG4gIGRlbDogJ2RlbCcsXG4gIGRldGFpbHM6ICdkZXRhaWxzJyxcbiAgZGZuOiAnZGZuJyxcbiAgZGlhbG9nOiAnZGlhbG9nJyxcbiAgZGl2OiAnZGl2JyxcbiAgZGw6ICdkbCcsXG4gIGR0OiAnZHQnLFxuICBlbTogJ2VtJyxcbiAgZW1iZWQ6ICdlbWJlZCcsXG4gIGZpZWxkc2V0OiAnZmllbGRzZXQnLFxuICBmaWdjYXB0aW9uOiAnZmlnY2FwdGlvbicsXG4gIGZpZ3VyZTogJ2ZpZ3VyZScsXG4gIGZvb3RlcjogJ2Zvb3RlcicsXG4gIGZvcm06ICdmb3JtJyxcbiAgaDE6ICdoMScsXG4gIGgyOiAnaDInLFxuICBoMzogJ2gzJyxcbiAgaDQ6ICdoNCcsXG4gIGg1OiAnaDUnLFxuICBoNjogJ2g2JyxcbiAgaGVhZDogJ2hlYWQnLFxuICBoZWFkZXI6ICdoZWFkZXInLFxuICBoZ3JvdXA6ICdoZ3JvdXAnLFxuICBocjogJ2hyJyxcbiAgaHRtbDogJ2h0bWwnLFxuICBpOiAnaScsXG4gIGlmcmFtZTogJ2lmcmFtZScsXG4gIGltZzogJ2ltZycsXG4gIGlucHV0OiAnaW5wdXQnLFxuICBpbnM6ICdpbnMnLFxuICBrYmQ6ICdrYmQnLFxuICBrZXlnZW46ICdrZXlnZW4nLFxuICBsYWJlbDogJ2xhYmVsJyxcbiAgbGVnZW5kOiAnbGVnZW5kJyxcbiAgbGk6ICdsaScsXG4gIGxpbms6ICdsaW5rJyxcbiAgbWFpbjogJ21haW4nLFxuICBtYXA6ICdtYXAnLFxuICBtYXJrOiAnbWFyaycsXG4gIG1lbnU6ICdtZW51JyxcbiAgbWVudWl0ZW06ICdtZW51aXRlbScsXG4gIG1ldGE6ICdtZXRhJyxcbiAgbWV0ZXI6ICdtZXRlcicsXG4gIG5hdjogJ25hdicsXG4gIG5vc2NyaXB0OiAnbm9zY3JpcHQnLFxuICBvYmplY3Q6ICdvYmplY3QnLFxuICBvbDogJ29sJyxcbiAgb3B0Z3JvdXA6ICdvcHRncm91cCcsXG4gIG9wdGlvbjogJ29wdGlvbicsXG4gIG91dHB1dDogJ291dHB1dCcsXG4gIHA6ICdwJyxcbiAgcGFyYW06ICdwYXJhbScsXG4gIHBpY3R1cmU6ICdwaWN0dXJlJyxcbiAgcHJlOiAncHJlJyxcbiAgcHJvZ3Jlc3M6ICdwcm9ncmVzcycsXG4gIHE6ICdxJyxcbiAgcnA6ICdycCcsXG4gIHJ0OiAncnQnLFxuICBydWJ5OiAncnVieScsXG4gIHM6ICdzJyxcbiAgc2FtcDogJ3NhbXAnLFxuICBzY3JpcHQ6ICdzY3JpcHQnLFxuICBzZWN0aW9uOiAnc2VjdGlvbicsXG4gIHNlbGVjdDogJ3NlbGVjdCcsXG4gIHNtYWxsOiAnc21hbGwnLFxuICBzb3VyY2U6ICdzb3VyY2UnLFxuICBzcGFuOiAnc3BhbicsXG4gIHN0cm9uZzogJ3N0cm9uZycsXG4gIHN0eWxlOiAnc3R5bGUnLFxuICBzdWI6ICdzdWInLFxuICBzdW1tYXJ5OiAnc3VtbWFyeScsXG4gIHN1cDogJ3N1cCcsXG4gIHRhYmxlOiAndGFibGUnLFxuICB0Ym9keTogJ3Rib2R5JyxcbiAgdGQ6ICd0ZCcsXG4gIHRleHRhcmVhOiAndGV4dGFyZWEnLFxuICB0Zm9vdDogJ3Rmb290JyxcbiAgdGg6ICd0aCcsXG4gIHRoZWFkOiAndGhlYWQnLFxuICB0aW1lOiAndGltZScsXG4gIHRpdGxlOiAndGl0bGUnLFxuICB0cjogJ3RyJyxcbiAgdHJhY2s6ICd0cmFjaycsXG4gIHU6ICd1JyxcbiAgdWw6ICd1bCcsXG4gICd2YXInOiAndmFyJyxcbiAgdmlkZW86ICd2aWRlbycsXG4gIHdicjogJ3dicicsXG5cbiAgLy8gU1ZHXG4gIGNpcmNsZTogJ2NpcmNsZScsXG4gIGNsaXBQYXRoOiAnY2xpcFBhdGgnLFxuICBkZWZzOiAnZGVmcycsXG4gIGVsbGlwc2U6ICdlbGxpcHNlJyxcbiAgZzogJ2cnLFxuICBpbWFnZTogJ2ltYWdlJyxcbiAgbGluZTogJ2xpbmUnLFxuICBsaW5lYXJHcmFkaWVudDogJ2xpbmVhckdyYWRpZW50JyxcbiAgbWFzazogJ21hc2snLFxuICBwYXRoOiAncGF0aCcsXG4gIHBhdHRlcm46ICdwYXR0ZXJuJyxcbiAgcG9seWdvbjogJ3BvbHlnb24nLFxuICBwb2x5bGluZTogJ3BvbHlsaW5lJyxcbiAgcmFkaWFsR3JhZGllbnQ6ICdyYWRpYWxHcmFkaWVudCcsXG4gIHJlY3Q6ICdyZWN0JyxcbiAgc3RvcDogJ3N0b3AnLFxuICBzdmc6ICdzdmcnLFxuICB0ZXh0OiAndGV4dCcsXG4gIHRzcGFuOiAndHNwYW4nXG5cbn0sIGNyZWF0ZURPTUZhY3RvcnkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0RE9NRmFjdG9yaWVzOyJdfQ==