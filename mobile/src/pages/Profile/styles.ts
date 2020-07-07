import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

export const Container = styled.View`
  justify-content: center;
  padding: 0 30px 40px;
  position: relative;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${getStatusBarHeight() + 24}px;
  left: 30px;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  color: #f4ede8;
  margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: ${getStatusBarHeight() + 24}px;
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const UserAvatar = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 98px;
`;

export const LogoutButton = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;

export const LogoutButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #959991;
  font-size: 16px;
`;
