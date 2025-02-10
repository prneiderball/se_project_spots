document.addEventListener("DOMContentLoaded", () => {
  // ------------------------ Modal Handling ------------------------ //

  const openModal = (modal) => modal.classList.add("modal--opened");

  const closeModal = (modal) => modal.classList.remove("modal--opened");

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(event.target);
    }
  };

  const setupModals = () => {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", handleOverlayClick);
    });
  };

  setupModals();

  // --------------------- Form Validation Logic --------------------- //

  const showInputError = (inputElement, errorMessage) => {
    const errorElement =
      inputElement.parentElement.querySelector(".modal__error");
    inputElement.classList.add("modal__input--error");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("modal__error--active");
  };

  const hideInputError = (inputElement) => {
    const errorElement =
      inputElement.parentElement.querySelector(".modal__error");
    inputElement.classList.remove("modal__input--error");
    errorElement.textContent = "";
    errorElement.classList.remove("modal__error--active");
  };

  const checkInputValidity = (inputElement) => {
    if (!inputElement.validity.valid) {
      showInputError(inputElement, inputElement.validationMessage);
    } else {
      hideInputError(inputElement);
    }
  };

  const hasInvalidInput = (inputList) =>
    inputList.some((input) => !input.validity.valid);

  const toggleButtonState = (inputList, buttonElement) => {
    buttonElement.classList.toggle(
      "button--inactive",
      hasInvalidInput(inputList)
    );
  };

  const setupFormValidation = () => {
    const forms = document.querySelectorAll("form");

    forms.forEach((formElement) => {
      const inputList = Array.from(formElement.querySelectorAll("input"));
      const submitButton = formElement.querySelector(".modal__submit-btn");

      inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", () => {
          checkInputValidity(inputElement);
          toggleButtonState(inputList, submitButton);
        });
      });

      toggleButtonState(inputList, submitButton);

      formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(`Form "${formElement.getAttribute("name")}" submitted.`);
      });
    });
  };

  setupFormValidation();
});
