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

  const showInputError = (formElement, inputElement, errorMessage) => {
    let errorElement = formElement.querySelector(`.${inputElement.id}-error`);

    if (!errorElement) {
      errorElement = inputElement.parentElement.querySelector(".modal__error");
    }

    if (errorElement) {
      inputElement.classList.add("modal__input--error");
      errorElement.textContent = errorMessage;
      errorElement.classList.add("modal__error--active");
    }
  };

  const hideInputError = (formElement, inputElement) => {
    let errorElement = formElement.querySelector(`.${inputElement.id}-error`);

    if (!errorElement) {
      errorElement = inputElement.parentElement.querySelector(".modal__error");
    }

    if (errorElement) {
      inputElement.classList.remove("modal__input--error");
      errorElement.textContent = "";
      errorElement.classList.remove("modal__error--active");
    }
  };

  const checkInputValidity = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(formElement, inputElement);
    }
  };

  const hasInvalidInput = (inputList) =>
    inputList.some((input) => !input.validity.valid);

  const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add("button--inactive");
    } else {
      buttonElement.classList.remove("button--inactive");
    }
  };

  const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll("input"));
    const submitButton = formElement.querySelector(".modal__submit-btn");

    toggleButtonState(inputList, submitButton);

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputList, submitButton);
      });
    });
  };

  const enableValidation = () => {
    const forms = document.querySelectorAll("form");

    forms.forEach((formElement) => {
      formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(`Form "${formElement.getAttribute("name")}" submitted.`);
      });

      const fieldsetList = formElement.querySelectorAll(".form__set");
      if (fieldsetList.length > 0) {
        fieldsetList.forEach((fieldset) => setEventListeners(fieldset));
      } else {
        setEventListeners(formElement);
      }
    });
  };

  enableValidation();
});
