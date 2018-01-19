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
      line-height: 1.5;
    }

    a { text-decoration: none }

    .truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; 
    }

    ::-moz-selection { background: #eee }
    ::selection { background: #eee }
  `
}

function copy () {
  return `
    .copy > *,
    .editor-preview-side > *,
    .editor-preview > * {
      margin-top: 1.5rem; margin-bottom: 1.5rem;
    }

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
      margin: -0.75rem -0.75rem -0.75rem 0.75rem;
      background-image: url('data:image/svg+xml;utf8,<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect height="5" width="5" x="0" y="0" fill="rgba(127, 127, 127, 0.15)" /><rect height="5" width="5" x="5" y="5" fill="rgba(127, 127, 127, 0.15)" /></svg>');
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
    input, textarea {
      padding: 0.5rem;
    }

    .select {
      position: relative;
      width: 100%;
    }

    .select select {
      cursor: pointer;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: #fff;
      padding: 0.5rem;
      border: 1px solid #000;
      border-radius: 3px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      line-height: 1.5;
      font-size: 1rem;
      font-weight: 400;
      outline: 0;
      width: 100%;
    }

    .select:before {
      content: '↓';
      position: absolute;
      font-size: 1.15rem;
      top: 0;
      right: 0;
      padding: 0.5rem 0.75rem 0 0;
      font-family: "SFMono-Light", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    }

    .input {
      border: 1px solid #000;
      border-radius: 3px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      line-height: 1.5;
      font-size: 1rem;
      font-weight: 400;
      outline: 0;
      width: 100%;
    }

    .input-disabled {
      border: 1px solid #ccc;
      color: #999;
    }

    [tabindex] { outline: 0 }

    textarea {
      min-height: 10rem;
    }

    button { outline: 0 }
    button:focus { outline: 0 }

    .button-inline {
      background: #eee;
      color: #000;
      padding: 4px;
      margin: 0 2px;
      border-radius: 3px;
      font: inherit;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
    }

    .button-inline:hover {
      background: #000;
      color: #fff;
    }
  `
}

function extensions () {
  return `
    .psst { position: sticky; position: -webkit-sticky; }
    .br1 { border-radius: 3px }

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

    .myc1 > * { border-top: 1px solid #ddd }
    .myc1 > *:last-child { border-bottom: 1px solid #ddd }

    .breadcrumbs {
      display: flex;
      overflow-y: hidden;
      width: 100%;
    }

    .breadcrumbs > a {
      display: block;
      position: relative;
      color: ${options.colors.bg70};
    }

    .breadcrumbs > a:hover {
      color: ${options.colors.bg};
    }

    .breadcrumbs > a:before {
      background: ${options.colors.bg90};
      content: '';
      display: block;
      height: 2rem;
      width: 1px;
      position: absolute;
      top: 0.5rem;
      right: 0;
      transform: rotate(15deg);
    }
  `
}

function loader () {
  return `
    .loader,
    .loader:after {
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
    }

    .loader {
      margin: 0 auto;
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border-top: 2px solid #fff;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #000;
      border-left: 2px solid #000;
      animation: load 1.1s infinite linear;
    }

    @keyframes load {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  `
}