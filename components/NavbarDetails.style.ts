import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1.5,
  },
  textContainer: {
    flexDirection: 'row',
    gap: 50
  },
  screenNavigationTextContainer: {
    flexDirection: 'row',
    gap: 15,
    alignSelf: 'center'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  screenNavigationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
    alignSelf: 'center',
  },
  dropdownText: {
    color: '#ffffff',
    backgroundColor: '#0569FF',
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    width: 200,
    textAlign: 'center'
  },
  dropdownContainer: {
    alignSelf: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    color: '#333',
    fontSize: 16,
  },
});

export default styles;