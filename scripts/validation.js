document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing form validation...");

  // ------------------------ Error Handling Functions ------------------------ //

  const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    if (!errorElement) return;
    inputElement.classList.add("modal__input--error");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("modal__error--active");
  };

  const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    if (!errorElement) return;
    inputElement.classList.remove("modal__input--error");
    errorElement.textContent = "";
    errorElement.classList.remove("modal__error--active");
  };

  const checkInputValidity = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(formElement, inputElement);
    }
  };

  // ------------------------ Form Validation ------------------------ //

  const hasInvalidInput = (inputList) =>
    inputList.some((input) => !input.validity.valid);

  const toggleButtonState = (inputList, buttonElement) => {
    console.log("Toggling button state...");
    console.log(
      "Current input values:",
      inputList.map((input) => input.value)
    );

    if (hasInvalidInput(inputList)) {
      console.log("Disabling button, invalid inputs present.");
      buttonElement.classList.add("modal__submit-btn--disabled");
      buttonElement.setAttribute("disabled", true);
    } else {
      console.log("Enabling button, all inputs valid.");
      buttonElement.classList.remove("modal__submit-btn--disabled");
      buttonElement.removeAttribute("disabled");
    }
  };

  const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
    const submitButton = formElement.querySelector(".modal__submit-btn");

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputList, submitButton);
      });
    });

    console.log(
      `Set up validation for form: ${formElement.getAttribute("name")}`
    );
  };

  const enableValidation = () => {
    document.querySelectorAll("form").forEach((formElement) => {
      setEventListeners(formElement);
    });
  };

  enableValidation();

  // ------------------------ Modal Handling ------------------------ //

  const openModal = (modalElement) => {
    if (!modalElement) return;

    console.log(`Opening modal: ${modalElement.id}`);

    const formElement = modalElement.querySelector("form");
    if (formElement) {
      const inputList = Array.from(
        formElement.querySelectorAll(".modal__input")
      );
      const submitButton = formElement.querySelector(".modal__submit-btn");

      inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement);
      });
      toggleButtonState(inputList, submitButton);
    }

    modalElement.classList.add("modal--opened");
  };

  const closeModal = (modalElement) => {
    if (!modalElement) return;
    console.log(`Closing modal: ${modalElement.id}`);
    modalElement.classList.remove("modal--opened");
  };

  // ------------------------ Event Listeners for Modals ------------------------ //

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const modalId = event.target.getAttribute("data-open-modal");
      openModal(document.querySelector(`#${modalId}`));
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        closeModal(event.target);
      }
    });
  });
});
