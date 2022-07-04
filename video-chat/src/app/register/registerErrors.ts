
// objekt zawiera metody które wyświetlają informacje o błędzie
export const errors = {
    err_len: (errorsElement: HTMLElement, settings: any) => errorsElement.innerHTML = `
    <p>Login powinien mieć od ${settings.login.minLen} do ${settings.login.maxLen} znaków.</p>
    <p>Hasło powinien mieć od ${settings.password.minLen} do ${settings.password.maxLen} znaków.</p>`,

    err_isset: (errorsElement: HTMLElement) => errorsElement.innerHTML = `<p>Istnieje już użytkownik o podanym loginie</p>`
}