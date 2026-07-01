import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value || '';

        const passwordStrength = {
            hasUpperCase: /[A-Z]/.test(value),
            hasLowerCase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[@$!%*?&]/.test(value),
            hasMinLength: value.length >= 6
        };

        const isValid = Object.values(passwordStrength).every(Boolean);

        return isValid ? null : { passwordStrength };
    };
}