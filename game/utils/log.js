export const styles = {
  base: [
    'color: #fff',
    'background-color: #444',
    'padding: 2px 4px',
    'border-radius: 2px'
  ],
  warning: ['color: #eee', 'background-color: orange'],
  success: ['background-color: green'],
  error: ['background-color: red']
}
export const log = (text, extra = []) => {
  let style = styles.base.join(';') + ';'
  style += extra.join(';') // Add any additional styles
  console.log(`%c${text}`, style)
}
