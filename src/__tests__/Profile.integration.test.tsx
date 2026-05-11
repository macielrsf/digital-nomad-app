import { fireEvent, screen } from '@testing-library/react-native';
import { AuthUser } from '../domain/auth/AuthUser';
import { renderApp } from '../test-utils/renderApp';

const mockedAuthUser: AuthUser = {
  id: '1',
  email: 'macielrsf@gmail.com',
  fullname: 'Maciel Rodrigues',
  createdAt: '2026-05-23T10:32:55.10671Z',
};

describe('integration: Profile', () => {
  it('should update the profile info', async () => {
    renderApp({
      isAuthenticated: true,
      repositories: {
        auth: {
          getUser: () => mockedAuthUser,
        },
      },
    });

    fireEvent.press(await screen.findByText('Perfil'));

    expect(await screen.findByText(/Informações da Conta/i)).toBeOnTheScreen();

    expect(await screen.findByText('Maciel Rodrigues')).toBeOnTheScreen();
    expect(await screen.findByText('macielrsf@gmail.com')).toBeOnTheScreen();
    expect(await screen.findByText('maio 2026')).toBeOnTheScreen();

    fireEvent.press(screen.getByText(/editar perfil/i));
    expect(await screen.findByText(/Atualizar Perfil/i)).toBeOnTheScreen();

    fireEvent.changeText(
      screen.getByTestId('fullname-input'),
      'Maciel Rodrigues'
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    // verify toast message
    expect(
      await screen.findByText('perfil atualizado com sucesso')
    ).toBeOnTheScreen();

    expect(await screen.findByText(/Informações da Conta/i)).toBeOnTheScreen();
  });
});
