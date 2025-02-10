document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing form validation...");

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
      buttonElement.classList.add("button--inactive");
      buttonElement.setAttribute("disabled", true);
    } else {
      console.log("Enabling button, all inputs valid.");
      buttonElement.classList.remove("button--inactive");
      buttonElement.removeAttribute("disabled");
    }
  };

  const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
    const submitButton = formElement.querySelector(".modal__submit-btn");

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
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
        formElement.querySelectorAll(".form__input")
      );
      const buttonElement = formElement.querySelector(".modal__submit-btn");

      toggleButtonState(inputList, buttonElement);
    }

    modalElement.classList.add("modal--opened");
  };

  const closeModal = (modalElement) => {
    if (!modalElement) return;
    console.log(`Closing modal: ${modalElement.id}`);
    modalElement.classList.remove("modal--opened");
  };

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
