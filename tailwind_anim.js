export default {
  theme: {
    extend: {
      animation: {
        ripple: 'ripple 0.6s linear',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 1 },
          '100%': { transform: 'scale(40)', opacity: 0 },
        }
      }
    }
  }
}
