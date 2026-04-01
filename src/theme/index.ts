export const Colors = {
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  surface2: '#F0F2F8',
  border: '#E4E7F0',
  ink: '#0D1117',
  ink2: '#3D4557',
  ink3: '#8892A8',
  ink4: '#B8BFCE',
  blue: '#1A56DB',
  blueLight: '#EBF0FF',
  green: '#0B7B5E',
  greenLight: '#E6F5F0',
  amber: '#B45309',
  amberLight: '#FEF3C7',
  red: '#C0392B',
  redLight: '#FEE9E7',
  purple: '#7C3AED',
  purpleLight: '#F3E8FF',
  white: '#FFFFFF',
};

export const Radius = {
  card: 14,
  pill: 100,
  button: 12,
  input: 10,
  icon: 9,
  sheet: 24,
};

export const Shadows = {
  card: {
    shadowColor: '#0D1117',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
};

export const Fonts = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semiBold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
  extraBold: { fontWeight: '800' as const },
};
