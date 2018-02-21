var options = require('./options')

module.exports = [
  typography(),
  copy(),
  media(),
  inputs(),
  extensions(),
  loader()
].join(' ')

function typography () {
  return `  
    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
      font-size: 62.50%;
      height: auto;
    }

    body { line-height: 2rem; }

    a {
      color: ${options.colors.fg};
      text-decoration: none;
    }

    .truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; 
    }

    .drtl { direction: rtl }
    .dltr { direction: ltr }

    ::-moz-selection { background: rgba(127, 127, 127, 0.5) }
    ::selection { background: rgba(127, 127, 127, 0.5) }

    .nav-link { position: relative }
    .nav-link:before {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -0.75rem;
      height: 1.5rem;
      width: 1.5rem;
      transform: translateY(4.5rem) rotate(45deg);
      transition: transform ease-out 250ms;
    }

    .nav-link.light:before {
      box-shadow: 0 0 3rem #ddd;
      background: ${options.colors.bg};
    }

    .nav-link.dark:before {
      background: var(--highlight);
    }

    .nav-active:before {
      transform: translateY(0.75rem) rotate(45deg);
    }

    .nav-active.dark:before {
      transform: translateY(1.75rem) rotate(45deg);
    }

    @font-face {
      font-family: 'Inter UI';
      font-style:  normal;
      font-weight: 400;
      src: url("/assets/fonts/Inter-UI-Regular.woff2?v=2.4") format("woff2"),
           url("/assets/fonts/Inter-UI-Regular.woff?v=2.4") format("woff");
    }

    @font-face {
      font-family: 'Inter UI';
      font-style:  italic;
      font-weight: 400;
      src: url("/assets/fonts/Inter-UI-Italic.woff2?v=2.4") format("woff2"),
           url("/assets/fonts/Inter-UI-Italic.woff?v=2.4") format("woff");
    }

    @font-face {
      font-family: 'Inter UI';
      font-style:  normal;
      font-weight: 700;
      src: url("/assets/fonts/Inter-UI-Bold.woff2?v=2.4") format("woff2"),
           url("/assets/fonts/Inter-UI-Bold.woff?v=2.4") format("woff");
    }
  `
}

function copy () {
  return `
    .copy {
      line-height: 1.5;
      max-width: 60rem;
      width: 100%;
    }

    .copy h2 { font-size: 3.6rem; font-weight: 600; line-height: 1.25; }
    .copy h3 { font-size: 2.7rem; }

    .copy code {
      font-family: ${options.typography.mono};
      background: ${options.colors.bg5};
      border-radius: 3px;
      padding: 0.2rem;
    }

    .bgc-fg .copy code {
      background: ${options.colors.bg90};
    }

    .fc-bg25 .copy a {
      color: ${options.colors.bg25};
    }

    .fc-bg25 .copy h2,
    .fc-bg25 .copy h3 {
      color: ${options.colors.bg};
    }

    .fc-bg25 .copy ol li:before {
      color: ${options.colors.bg70};
    }

    .copy > *,
    .editor-preview-side > *,
    .editor-preview > * {
      margin-top: 2rem; margin-bottom: 2rem;
    }

    .copy > h2:not(:first-child) { margin-top: 4rem; }

    .copy img,
    .editor-preview-side img,
    .editor-preview img {
      max-width: 100%;
    }

    .copy a,
    .editor-preview-side a,
    .editor-preview a {
      text-decoration: underline;
    }

    .copy ul li {
      list-style: disc;
      padding-left: 2rem;
      margin-left: 2rem;
    }

    .copy ol li {
      position: relative;
      padding-left: 4rem;
      margin-left: 0;
    }

    .copy ol li:before {
      position: absolute;
      left: 0;
      font-family: ${options.typography.mono};
    }

    .copy ol li:nth-child(1):before { content: '1' }
    .copy ol li:nth-child(2):before { content: '2' }
    .copy ol li:nth-child(3):before { content: '3' }
    .copy ol li:nth-child(4):before { content: '4' }
    .copy ol li:nth-child(5):before { content: '5' }
    .copy ol li:nth-child(6):before { content: '6' }

    .copy input {
      margin: 0;
      line-height: 1;
      height: 1.8rem;
    }

    .copy-small > * {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .copy-small h2 { font-size: 1.8rem; font-weight: 600; line-height: 1.25; }
    .copy-small h3 { font-size: 1.4rem; }

    .copy > h2:not(:first-child) { margin-top: 2rem; }

    .copy > *:first-child,
    .editor-preview-side > *:first-child,
    .editor-preview > *:first-child {
      margin-top: 0
    }

    .copy > *:last-child,
    .editor-preview-side > *:last-child,
    .editor-preview > *:last-child {
      margin-bottom: 0
    }

    .copy-small ul li {
      list-style: disc;
      padding-left: 0;
      margin-left: 2rem;
    }

    .copy-small ul li.task-list-item {
      list-style: none;
      padding-left: 0;
      margin-left: 0;
    }

    .copy-small ul li.task-list-item input {
      width: 2rem; 
    }

    .bgc-fg .copy-small code {
      background: ${options.colors.bg80};
    }
  `
}

function media () {
  return `
    .ofc {
      object-fit: contain;
      height: 100%;
      width: 100%;
      padding: 10vmin;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .file-preview {
      max-height: 100vh;
      margin: -3rem -3rem -3rem 2rem;
      width: calc(100% + 2rem);
      background-image: url('data:image/svg+xml;utf8,<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect height="5" width="5" x="0" y="0" fill="#f9f9f9" /><rect height="5" width="5" x="5" y="5" fill="#f9f9f9" /></svg>');
      background-repeat: repeat;
    }

    @media (max-width: 767px) {
      .file-preview {
        height: 100vh;
        width: 100vw;
        margin: -0.75rem;
      }

      .action-gradient { width: 100% }
    }
  `
}

function inputs () {
  return `
    .select {
      position: relative;
      width: 100%;
    }

    .select select {
      cursor: pointer;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: ${options.colors.bg};
      border: 1px solid ${options.colors.bg10};
      line-height: 4rem;
      padding: 0 3.5rem 0 1.5rem;
      border-radius: 2rem;
      font-family: ${options.typography.sans};
      line-height: 4rem;
      font-size: 1.8rem;
      font-weight: 400;
      outline: 0;
      width: 100%;
    }

    .select:before {
      content: '↓';
      position: absolute;
      font-size: 1.8rem;
      top: 0;
      right: 0;
      padding: 1.2rem 1.5rem 0.8rem;
      pointer-events: none;
      font-family: ${options.typography.mono};
    }

    .input {
      background: ${options.colors.bg};
      border: 1px solid ${options.colors.bg10};
      border-radius: 2rem;
      font-family: ${options.typography.sans};
      line-height: 2rem;
      font-size: 1.8rem;
      font-weight: 400;
      outline: 0;
      width: 100%;
    }

    [tabindex] { outline: 0 }
    .input.lh1-5 { line-height: 1.5 }
    .input-disabled { color: #999 }
    textarea { min-height: 10rem }

    input { height: 4rem; line-height: 4rem; }
    button { outline: 0 }
    button:focus { outline: 0 }

    .focused {
      box-shadow: 0 0 0 2px ${options.colors.yellow};
      border: 1px solid ${options.colors.yellow};
    }

    .button-large {
      user-select: none;
      line-height: 6rem;
      padding: 0 4rem;
      border-radius: 3rem;
      display: block;
      cursor: pointer;
      color: ${options.colors.bg};
      font-size: 1.8rem;
      text-align: center;
      white-space: nowrap;
      font-weight: 600;
      transition: background 150ms ease-out, transform 150ms ease-out;
    }

    .tfyh {
      transition: background 150ms ease-out, color 150ms ease-out, transform 150ms ease-out;
    }

    .tfyh:hover,
    .button-large:hover {
      transform: translateY(-0.2rem) ;
    }

    .tfyh:active,
    .button-large:active {
      transform: translateY(0.1rem) ;
      transition: transform 50ms ease-out;
    }

    .button-medium {
      user-select: none;
      line-height: 4rem;
      font-weight: 600;
      padding: 0 2rem;
      border-radius: 2rem;
      display: block;
      cursor: pointer;
      color: ${options.colors.bg};
      font-size: 1.8rem;
      white-space: nowrap;
      transition: background 150ms ease-out, transform 150ms ease-out;
    }

    .button-medium:hover {
      transform: translateY(-0.2rem) ;
    }

    .button-medium:active {
      transform: translateY(0.1rem) ;
      transition: transform 50ms ease-out;
    }

    .button-inline {
      display: inline-block;
      vertical-align: center;
      user-select: none;
      border: 1px solid ${options.colors.yellow};
      color: ${options.colors.yellow};
      margin: 0 0 0 0.5rem;
      padding: 0 1rem;
      line-height: 1.8rem;
      height: 2rem;
      border-radius: 1rem;
      text-transform: uppercase;
      white-space: nowrap;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      position: relative;
      z-index: 2;
      transition: background 150ms ease-out, color 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;
    }

    .button-inline:hover {
      border: 1px solid ${options.colors.fg};
      color: ${options.colors.fg};
      transform: translateY(-0.1rem);
    }

    .button-inline:active {
      transition: background 50ms ease-out, color 50ms ease-out, border 50ms ease-out, transform 50ms ease-out;
      transform: translateY(0.1rem);
    }

    .indicator {
      color: ${options.colors.bg};
      font-size: 1.4rem;
      font-weight: 600;
      text-align: center;
      display: block;
      cursor: pointer;
      font-family: ${options.typography.mono};
      border-radius: 1rem;
      line-height: 2rem;
      height: 2rem;
      width: 2rem;
    }
  `
}

function extensions () {
  return `
    .psst { position: sticky; position: -webkit-sticky; }
    .br1 { border-radius: 3px }
    .br2 { border-radius: 2rem }
    
    .t0-75 { top: 0.75rem }

    .tom { transition: opacity 150ms ease-out }
    .tfcm { transition: color 150ms ease-out }

    .external:after {
      content: '→';
      display: inline-block;
      transform: translateY(0.1rem) rotate(-45deg);
      margin-left: 0.5rem;
    }

    .action-gradient {
      background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 25%);
      background: -webkit-linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 25%);
      background: -moz-linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 25%);
      position: absolute;
      bottom: 0;
      left: 0;
      height: 7rem;
      width: 33.3%;
    }

    .myc1 > * { position: relative; }

    .myc1 > *:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: ${options.colors.bg10};
      height: 1px;
    }

    .myc1 > *:last-child:after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      background: ${options.colors.bg10};
      height: 1px;
    }

    .breadcrumbs {
      display: flex;
      width: 100%;
      line-height: 4rem;
    }

    a.breadcrumb,
    .breadcrumbs > a {
      display: block;
      position: relative;
      color: ${options.colors.bg25};
    }

    a.breadcrumb,
    a.breadcrumb:hover,
    .breadcrumbs > a:first-child,
    .breadcrumbs > a:hover {
      color: ${options.colors.fg};
    }

    .breadcrumb:before,
    .breadcrumbs > a:not(:first-child):before {
      background: ${options.colors.bg10};
      content: '';
      display: block;
      height: 4rem;
      width: 1px;
      position: absolute;
      top: 1rem;
      right: 0;
      transform: rotate(15deg);
    }

    ::-webkit-input-placeholder { color: ${options.colors.bg25}; }
    ::-moz-placeholder { color: ${options.colors.bg25}; }
    :-ms-input-placeholder { color: ${options.colors.bg25}; }
    :-moz-placeholder { color: ${options.colors.bg25}; }
  `
}

function loader () {
  return `
    .loader {
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
    }

    .loader {
      margin: 1.5rem;
      font-size: 3rem;
      position: relative;
      text-indent: -9999em;
      border-top: 2px solid ${options.colors.bg};
      border-right: 2px solid ${options.colors.bg};
      border-bottom: 2px solid ${options.colors.fg};
      border-left: 2px solid ${options.colors.fg};
      animation: load 1s infinite linear;
    }

    @keyframes load {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  `
}