import "./index.css";
import { Settings, resetValidation, enableValidation } from "../validation.js";
import Api from "../utils/Api.js";
import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencilIcon from "../images/pencil-icon.svg";
import plusIcon from "../images/plus.svg";

const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal?.querySelector(".modal__image");
const modalCaption = previewModal?.querySelector(".modal__caption");
const nameInput = document.querySelector("#name");
const jobInput = document.querySelector("#description");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const imageUrlInput = document.querySelector("#image_url");
const captionInput = document.querySelector("#new-post-caption-input");
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileAddBtn = document.querySelector(".profile__add-btn");
const editProfileForm = document.querySelector("#edit-profile-form");
const newPostForm = document.querySelector("#new-post-form");
const closeBtns = document.querySelectorAll(".modal__close-btn, .modal__close-preview");
const deleteModal = document.querySelector("#delete-modal");
const deleteConfirmBtn = deleteModal.querySelector(".modal__submit-btn_delete");
const deleteCancelBtn = deleteModal.querySelector(".modal__submit-btn_cancel");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarInput = avatarModal.querySelector("#avatar_url");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarPreview = document.querySelector(".profile__avatar");
const avatarEditBtn = document.querySelector(".profile__picture-btn");

profileNameElement.textContent = "Loading...";
profileJobElement.textContent = "Loading...";
avatarPreview.src = "";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "46c1a639-4215-418c-8205-87dec37d68b7",
    "Content-Type": "application/json"
  }
});

let selectedCard;
let selectedCardId;
let currentUserId;

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
  
    const isLiked = data.likes && data.likes.some(like => like._id === currentUserId);
    if (isLiked) {
      cardLikedBtn.classList.add("card__like-btn--liked");
    cardLikedBtn.addEventListener("click", () => {
      const shouldLike = !cardLikedBtn.classList.contains("card__like-btn--liked");
      api.toggleLike(data._id, shouldLike)
        .then(updatedCard => {
          data.likes = updatedCard.likes;
          cardLikedBtn.classList.toggle("card__like-btn--liked", shouldLike);
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
  
  

  cardLikedBtn.addEventListener("click", () => {
    const isLiked = cardLikedBtn.classList.contains("card__like-btn--liked");
    api.toggleLike(data._id, !isLiked)
      .then(updatedCard => {
        cardLikedBtn.classList.toggle("card__like-btn--liked", !isLiked);
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
    api.deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        selectedCard = null;
        selectedCardId = null;
        closePopup(deleteModal);
      })
      .catch(err => console.error("Error deleting card:", err));
  }
});

deleteCancelBtn.addEventListener("click", () => {
  closePopup(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

avatarEditBtn.addEventListener("click", () => {
  enableValidation(Settings);
  openPopup(avatarModal);
  resetValidation(avatarForm, Settings);  
});

function editAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value.trim();
  api.editProfileAvatar({ avatar: avatarUrl })
    .then(userData => {
      avatarPreview.src = userData.avatar || avatar;
      closePopup(avatarModal);
    })
    .catch(err => console.error("Error updating avatar:", err));
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
  evt.preventDefault();
  api.editUserInfo({
    name: nameInput.value,
    about: jobInput.value
  })
    .then(userData => {
      profileNameElement.textContent = userData.name;
      profileJobElement.textContent = userData.about;
      closePopup(editProfileModal);
    })
    .catch(err => console.error("Error updating profile:", err));
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const name = captionInput.value.trim();
  const link = imageUrlInput.value.trim();
  api.addNewCard({ name, link })
    .then(cardData => {
      const cardElement = createCardElement(cardData);
      cardList.prepend(cardElement);
      closePopup(newPostModal);
      newPostForm.reset();
    })
    .catch(err => console.error("Error adding card:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  profileEditBtn.addEventListener("click", () => {
    nameInput.value = profileNameElement.textContent;
    jobInput.value = profileJobElement.textContent;
    resetValidation(editProfileForm, Settings);
    openPopup(editProfileModal);
  });

  profileAddBtn.addEventListener("click", () => openPopup(newPostModal));
  editProfileForm.addEventListener("submit", handleProfileFormSubmit);
  newPostForm.addEventListener("submit", handleCardFormSubmit);
  avatarForm.addEventListener("submit", editAvatarFormSubmit);
  closeBtns.forEach((btn) =>
    btn.addEventListener("click", () => closePopup(btn.closest(".modal")))
  );
});

enableValidation(Settings);
