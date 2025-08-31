// Your custom SVG icons as strings for DOM component use (rounded versions)
export const editorIcons = {
  bold: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 12H15C16.0609 12 17.0783 12.4214 17.8284 13.1716C18.5786 13.9217 19 14.9391 19 16C19 17.0609 18.5786 18.0783 17.8284 18.8284C17.0783 19.5786 16.0609 20 15 20H7C6.73478 20 6.48043 19.8946 6.29289 19.7071C6.10536 19.5196 6 19.2652 6 19V5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4H14C15.0609 4 16.0783 4.42143 16.8284 5.17157C17.5786 5.92172 18 6.93913 18 8C18 9.06087 17.5786 10.0783 16.8284 10.8284C16.0783 11.5786 15.0609 12 14 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  italic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 4H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 20H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 4L9 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  underline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 4V10C6 11.5913 6.63214 13.1174 7.75736 14.2426C8.88258 15.3679 10.4087 16 12 16C13.5913 16 15.1174 15.3679 16.2426 14.2426C17.3679 13.1174 18 11.5913 18 10V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 20H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  strikethrough: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16.0001 4H9.00011C8.52003 3.99975 8.04691 4.11471 7.62048 4.33524C7.19405 4.55576 6.82677 4.8754 6.5495 5.26731C6.27223 5.65921 6.09305 6.11194 6.02704 6.58745C5.96102 7.06297 6.01008 7.54738 6.17011 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 12C15.0609 12 16.0783 12.4214 16.8284 13.1716C17.5786 13.9217 18 14.9391 18 16C18 17.0609 17.5786 18.0783 16.8284 18.8284C16.0783 19.5786 15.0609 20 14 20H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  code: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 18L22 12L16 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 6L2 12L8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  list: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 12H3.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 18H3.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 6H3.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  numberedList: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 10H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 6H5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 17.9999H4C4 16.9999 6 15.9999 6 14.9999C6 13.9999 5 13.4999 4 13.9999" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  quote: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 17C22 17.5304 21.7893 18.0391 21.4142 18.4142C21.0391 18.7893 20.5304 19 20 19H6.828C6.29761 19.0001 5.78899 19.2109 5.414 19.586L3.212 21.788C3.1127 21.8873 2.9862 21.9549 2.84849 21.9823C2.71077 22.0097 2.56803 21.9956 2.43831 21.9419C2.30858 21.8881 2.1977 21.7971 2.11969 21.6804C2.04167 21.5637 2.00002 21.4264 2 21.286V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 13C14.5304 13 15.0391 12.7893 15.4142 12.4142C15.7893 12.0391 16 11.5304 16 11V9H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 13C8.53043 13 9.03914 12.7893 9.41421 12.4142C9.78929 12.0391 10 11.5304 10 11V9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 17H7C5.67392 17 4.40215 16.4732 3.46447 15.5355C2.52678 14.5979 2 13.3261 2 12C2 10.6739 2.52678 9.40215 3.46447 8.46447C4.40215 7.52678 5.67392 7 7 7H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 7H17C18.3261 7 19.5979 7.52678 20.5355 8.46447C21.4732 9.40215 22 10.6739 22 12C22 13.3261 21.4732 14.5979 20.5355 15.5355C19.5979 16.4732 18.3261 17 17 17H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  color: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C14.6522 2 17.1957 2.94821 19.0711 4.63604C20.9464 6.32387 22 8.61305 22 11C22 12.3261 21.4732 13.5979 20.5355 14.5355C19.5979 15.4732 18.3261 16 17 16H14.75C14.425 16 14.1064 16.0905 13.83 16.2614C13.5535 16.4322 13.3301 16.6767 13.1848 16.9674C13.0394 17.2581 12.9779 17.5835 13.0071 17.9072C13.0363 18.2308 13.155 18.54 13.35 18.8L13.65 19.2C13.845 19.46 13.9637 19.7692 13.9929 20.0928C14.0221 20.4165 13.9606 20.7419 13.8152 21.0326C13.6699 21.3233 13.4465 21.5678 13.17 21.7386C12.8936 21.9095 12.575 22 12.25 22H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="13.5" cy="6.5" r="0.5" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="17.5" cy="10.5" r="0.5" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="6.5" cy="12.5" r="0.5" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="8.5" cy="7.5" r="0.5" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,
  
  highlighter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 11L22 2L20 4L11 15L9 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 15L2 22L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};