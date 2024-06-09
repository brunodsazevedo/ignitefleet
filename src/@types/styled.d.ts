import 'styled-components';
import theme from '../theme'

// and extend them!
declare module 'styled-components' {
  type ThemeType = typeof theme

  export interface DefaultTheme extends ThemeType {}
}
