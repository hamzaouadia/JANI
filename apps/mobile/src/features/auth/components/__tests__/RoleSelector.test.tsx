/// <reference types="jest" />
import { fireEvent } from '@testing-library/react-native';

import { USER_ROLES } from '@/constants/userRoles';
import { renderWithProviders } from '@/utils/test-utils';

import { RoleSelector } from '../RoleSelector';

describe('RoleSelector', () => {
  it('invokes onSelect when a role is chosen', () => {
    const handleSelect = jest.fn();
    const { getByText } = renderWithProviders(
      <RoleSelector selected={USER_ROLES[0].value} onSelect={handleSelect} />
    );

    const targetRole = USER_ROLES[2];
    fireEvent.press(getByText(targetRole.label));

    expect(handleSelect).toHaveBeenCalledWith(targetRole.value);
  });
});
