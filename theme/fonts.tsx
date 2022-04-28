import { Global } from "@emotion/react"
const Fonts = () => (
	<Global
		styles={`
        @font-face {
            font-family: '~~';
            src: url('/fonts/~~.woff2') format('woff2');
            font-weight: ~~;
            font-display: optional;
            font-style: normal;
        }
        `}
	/>
)
export default Fonts
