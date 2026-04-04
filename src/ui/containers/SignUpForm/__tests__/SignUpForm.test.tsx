import { renderComponent } from '@/src/test-utils/renderComponent';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { SignUpForm } from '../SignUpForm';

describe('<SignUpForm />', () => {
  it('should submit the form when all fields are filled in correctly', async () => {
    const onSubmitMock = jest.fn();
    renderComponent(<SignUpForm onSubmit={onSubmitMock} />);

    fireEvent.changeText(
      screen.getByTestId('fullname-input'),
      'Maciel Rodrigues'
    );
    fireEvent.changeText(
      screen.getByTestId('email-input'),
      'macielrsf@gmail.com'
    );
    fireEvent.changeText(screen.getByTestId('password-input'), '12345678');
    fireEvent.changeText(
      screen.getByTestId('confirm-password-input'),
      '12345678'
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          fullname: 'Maciel Rodrigues',
          email: 'macielrsf@gmail.com',
          password: '12345678',
        }),
        undefined // React Hook Form onInvalid callback is optional, so it will be undefined if not provided
      );
    });
  });
});
