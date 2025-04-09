// index.js

import "./index.css";
import { Settings, resetValidation, enableValidation } from "../validation.js";
import Api from "../utils/Api.js";
import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencilIcon from "../images/pencil-icon.svg";
import plusIcon from "../images/plus.svg";
import { renderLoading, handleSubmit } from "../utils/formhandler.js";

const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal?.querySelector(".modal__image");
const modalCaption = previewModal?.querySelector(".modal__caption");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const avatarPreview = document.querySelector(".profile__avatar");
const avatarEditBtn = document.querySelector(".profile__picture-btn");
const profileAddBtn = document.querySelector(".profile__add-btn");
const closeBtns = document.querySelectorAll(".modal__close-btn, .modal__close-preview");
const deleteModal = document.querySelector("#delete-modal");
const deleteConfirmBtn = deleteModal.querySelector(".modal__submit-btn_delete");
const deleteCancelBtn = deleteModal.querySelector(".modal__submit-btn_cancel");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarInput = avatarModal.querySelector("#avatar_url");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const profileEditBtn = document.querySelector(".profile__edit-btn");

let selectedCard;
let selectedCardId;
let currentUserId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "46c1a639-4215-418c-8205-87dec37d68b7",
    "Content-Type": "application/json"
  }
});

api.getUserInfo()
  .then(userData => {
    currentUserId = userData._id;
    profileNameElement.textContent = userData.name;
    profileJobElement.textContent = userData.about;
    avatarPreview.src = userData.avatar || avatar;
  })
  .catch(err => console.error("Error fetching user info:", err));

api.getInitialCards()
  .then(cards => {
    cards.forEach(card => {
      const cardElement = createCardElement(card);
      cardList.appendChild(cardElement);
    });
  })
  .catch(err => console.error("Error loading cards:", err));

function createCardElement(data) {
  const cardElement = cardTemplate.content.querySelector("li").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) {
    cardLikedBtn.classList.add("card__like-btn--liked");
  }

  cardLikedBtn.addEventListener("click", () => {
    const isCurrentlyLiked = cardLikedBtn.classList.contains("card__like-btn--liked");

    api.toggleLike(data._id, !isCurrentlyLiked)
      .then(updatedCard => {
        cardLikedBtn.classList.toggle("card__like-btn--liked", updatedCard.isLiked);
      })
      .catch(err => console.error("Error toggling like:", err));
  });

  cardImage.addEventListener("click", () => openImageModal(data.link, data.name));

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedCard = cardElement;
    selectedCardId = data._id;
    openPopup(deleteModal);
  });

  return cardElement;
}

deleteConfirmBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (selectedCardId) {
    const originalText = deleteConfirmBtn.textContent;
    deleteConfirmBtn.textContent = "Deleting...";

    api.deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        selectedCard = null;
        selectedCardId = null;
        closePopup(deleteModal);
      })
      .catch(err => console.error("Error deleting card:", err))
      .finally(() => {
        deleteConfirmBtn.textContent = originalText;
      });
  }
});

deleteCancelBtn.addEventListener("click", () => {
  closePopup(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

avatarEditBtn.addEventListener("click", () => {
  openPopup(avatarModal);
  resetValidation(avatarModal.querySelector("form"), Settings);
});

function editAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value.trim();

  if (avatarUrl) {
    api.editProfileAvatar({ avatar: avatarUrl })
      .then(userData => {
        avatarPreview.src = userData.avatar || avatar;
        closePopup(avatarModal);
      })
      .catch(err => console.error("Error updating avatar:", err));
  }
}

function openImageModal(imageUrl, imageCaption) {
  if (!previewModal || !modalImage || !modalCaption) return;
  modalImage.src = imageUrl;
  modalImage.alt = imageCaption;
  modalCaption.textContent = imageCaption;
  openPopup(previewModal);
}

function openPopup(popup) {
  popup.classList.add("modal--opened");
  document.addEventListener("keydown", handleEscKey);
  popup.addEventListener("click", handleClickOutsideModal);
}

function closePopup(popup) {
  popup.classList.remove("modal--opened");
  document.removeEventListener("keydown", handleEscKey);
  popup.removeEventListener("click", handleClickOutsideModal);
}

function handleEscKey(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal--opened");
    if (openedModal) closePopup(openedModal);
  }
}

function handleClickOutsideModal(e) {
  if (e.target.classList.contains("modal")) closePopup(e.target);
}

function handleProfileFormSubmit(evt) {
  function makeRequest() {
    const profileForm = document.forms["edit-profile"];
    return api.editUserInfo({
      name: profileForm.name.value,
      about: profileForm.description.value
    }).then(userData => {
      profileNameElement.textContent = userData.name;
      profileJobElement.textContent = userData.about;
      closePopup(editProfileModal);
    });
  }

  handleSubmit(makeRequest, evt);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const postForm = document.forms["new-post"];
  const submitBtn = postForm.querySelector(".modal__submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Saving...";

  const name = postForm["new-post-caption-input"].value.trim();
  const link = postForm["image_url"].value.trim();

  function makeRequest() {
    return api.addNewCard({ name, link })
      .then(cardData => {
        const cardElement = createCardElement(cardData);
        cardList.prepend(cardElement);
        closePopup(newPostModal);
        postForm.reset();
      })
      .catch(err => console.error("Error adding new card:", err));
  }

  handleSubmit(makeRequest, evt)
  .finally(() => {
    submitBtn.textContent = originalText;
    toggleSubmitButton(postForm);
  });
}

function toggleSubmitButton(postForm) {
  if (!postForm) return;
  const submitButton = postForm.querySelector(".modal__submit-btn");
  const caption = postForm.querySelector("input[name='new-post-caption-input']");
  const imageUrl = postForm.querySelector("input[name='image_url']");

  if (!submitButton || !caption || !imageUrl) {
    console.warn("Form elements not found.");
    return;
  }

  const captionValue = caption.value.trim();
  const imageUrlValue = imageUrl.value.trim();
  const isValid = captionValue !== "" && imageUrlValue !== "";

  submitButton.disabled = !isValid;
  submitButton.classList.toggle("disabled", !isValid);
}

document.addEventListener("DOMContentLoaded", () => {
  profileAddBtn.addEventListener("click", () => {
    const postForm = document.forms["new-post"];
    openPopup(newPostModal);
    resetValidation(postForm, Settings);

    const captionInput = postForm.querySelector("input[name='new-post-caption-input']");
    const imageUrlInput = postForm.querySelector("input[name='image_url']");

    if (captionInput && imageUrlInput) {
      captionInput.addEventListener("input", () => toggleSubmitButton(postForm));
      imageUrlInput.addEventListener("input", () => toggleSubmitButton(postForm));
      toggleSubmitButton(postForm);
    }
  });

  profileEditBtn.addEventListener("click", () => {
    const profileForm = document.forms["edit-profile"];
    profileForm.name.value = profileNameElement.textContent;
    profileForm.description.value = profileJobElement.textContent;
    openPopup(editProfileModal);
    resetValidation(profileForm, Settings);
  });

  editProfileModal.querySelector(".modal__close-btn").addEventListener("click", () => closePopup(editProfileModal));
  newPostModal.querySelector(".modal__close-btn").addEventListener("click", () => closePopup(newPostModal));
  document.forms["edit-profile"].addEventListener("submit", handleProfileFormSubmit);
  document.forms["new-post"].addEventListener("submit", handleCardFormSubmit);
  avatarModal.querySelector("form").addEventListener("submit", editAvatarFormSubmit);
  closeBtns.forEach(btn => btn.addEventListener("click", () => closePopup(btn.closest(".modal"))));
});

enableValidation(Settings);
