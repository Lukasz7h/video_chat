
// po nieudanej próbie logowania wyświetlamy odpowiednie informacje
export function showError(errorsElement: HTMLElement)
{
    errorsElement.innerHTML = "<p>Podane dane są niepoprawne</p>";
};