const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];
// Get the card list and template elements
const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

// Function to create a card element from the template and data
function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  // Set the image and title
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  return cardElement;
}

// Function to render all cards on the page
function renderCards() {
  cardList.innerHTML = "";
  initialCards.forEach((cardData) => {
    const card = getCardElement(cardData);
    cardList.appendChild(card);
  });
}

// Call renderCards once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", renderCards);

// Profile logic
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileEditButton = document.querySelector(".profile__edit-btn");

// Modal logic
const editProfileModal = document.querySelector("#edit-profile-modal");
const modalCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const modalNameInput = editProfileModal.querySelector("#name");
const modalDescriptionInput = editProfileModal.querySelector("#description");
const profileFormElement = editProfileModal.querySelector("form");

// Functions to get and set profile data
function getProfileName() {
  return profileNameElement.textContent;
}

function setProfileName(name) {
  profileNameElement.textContent = name;
}

function getProfileDescription() {
  return profileDescriptionElement.textContent;
}

function setProfileDescription(description) {
  profileDescriptionElement.textContent = description;
}

// Function to open the modal
function openModal() {
  modalNameInput.value = getProfileName();
  modalDescriptionInput.value = getProfileDescription();
  editProfileModal.style.display = "flex";
}

// Function to close the modal
function closeModal() {
  editProfileModal.style.display = "none";
}

// Form handler for updating the profile
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  // Update profile with form values
  const updatedName = modalNameInput.value;
  const updatedDescription = modalDescriptionInput.value;

  setProfileName(updatedName);
  setProfileDescription(updatedDescription);

  closeModal();
}

// Event listeners
profileEditButton.addEventListener("click", openModal);
modalCloseBtn.addEventListener("click", closeModal);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
