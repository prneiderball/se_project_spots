import "./index.css";
import { Settings, resetValidation, enableValidation } from "../validation.js";
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

const initialCards = [
  { name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg" },
  { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "46c1a639-4215-418c-8205-87dec37d68b7",
    "Content-Type": "application/json"
  }
});

api.getInitialCards()
  .then((cards) => {console.log(cards);})/  .catch((err) => console.error("Error fetching initial cards:", err));

function createCardElement(data) {
  const cardElement = cardTemplate.content.querySelector("li").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardLikedBtn.addEventListener("click", () => cardLikedBtn.classList.toggle("card__like-btn--liked"));
  cardImage.addEventListener("click", () => openImageModal(data.link, data.name));
  deleteBtn.addEventListener("click", (e) => { e.stopPropagation(); cardElement.remove(); });

  return cardElement;
}

function openImageModal(imageUrl, imageCaption) {
  if (!previewModal || !modalImage || !modalCaption) return console.error("Modal components not found");
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
    const openedModal = document.querySelector(".modal.modal--opened");
    if (openedModal) closePopup(openedModal);
  }
}

function handleClickOutsideModal(e) {
  if (e.target.classList.contains("modal")) closePopup(e.target);
}

function renderCard(item, method = "prepend") {
  const cardElement = createCardElement(item);
  method === "prepend" ? cardList.prepend(cardElement) : cardList.appendChild(cardElement);
}

function renderInitialCards() {
  initialCards.forEach((cardData) => renderCard(cardData, "appendChild"));
}

function addNewCard(name, link) {
  if (name && link) renderCard({ name, link });
}

function populateProfileForm() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
}

function handleFormSubmit(e) {
  e.preventDefault();
  e.target.reset();
  resetValidation(e.target, Settings);
  closePopup(e.target.closest(".modal"));
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value.trim();
  profileJobElement.textContent = jobInput.value.trim();
  handleFormSubmit(evt);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  addNewCard(captionInput.value.trim(), imageUrlInput.value.trim());
  handleFormSubmit(evt);
}

document.addEventListener("DOMContentLoaded", () => {
  renderInitialCards();
  profileEditBtn.addEventListener("click", () => {
    populateProfileForm();
    resetValidation(editProfileForm, Settings);
    openPopup(editProfileModal);
  });
  profileAddBtn.addEventListener("click", () => openPopup(newPostModal));
  editProfileForm.addEventListener("submit", handleProfileFormSubmit);
  newPostForm.addEventListener("submit", handleCardFormSubmit);
  closeBtns.forEach((btn) => btn.addEventListener("click", () => closePopup(btn.closest(".modal"))));
});

enableValidation(Settings);