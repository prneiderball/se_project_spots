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

// Profile and Modal logic
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileEditButton = document.querySelector(".profile__edit-btn");
const newPostButton = document.querySelector(".profile__add-btn");

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const modals = [editProfileModal, newPostModal];

const modalNameInput = editProfileModal.querySelector("#name");
const modalDescriptionInput = editProfileModal.querySelector("#description");
const profileFormElement = editProfileModal.querySelector("form");

const imageUrlInput = newPostModal.querySelector("#image_url");
const captionInput = newPostModal.querySelector("#new-post-caption-input");
const newPostFormElement = newPostModal.querySelector(".modal__form");

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

// General function to open any modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (modalId === "edit-profile-modal") {
      modalNameInput.value = getProfileName();
      modalDescriptionInput.value = getProfileDescription();
    } else if (modalId === "new-post-modal") {
      imageUrlInput.value = "";
      captionInput.value = "";
    }
    modal.classList.add("modal_opened");
  }
}

// General function to close any modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// Function to close any modal when clicking outside of it
function handleClickOutsideModal(e) {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target);
  }
}

// Form handler for updating the profile
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  setProfileName(modalNameInput.value);
  setProfileDescription(modalDescriptionInput.value);
  closeModal(editProfileModal);
  evt.target.reset();
}

// Form handler for new post creation
function handleNewPostFormSubmit(evt) {
  evt.preventDefault();

  const newPostData = {
    name: captionInput.value,
    link: imageUrlInput.value,
  };

  // Basic validation
  if (!newPostData.link || !newPostData.name) {
    console.error("Please provide both an image URL and a caption.");
    return;
  }

  // Create a new card with the data
  const newCard = getCardElement(newPostData);
  cardList.prepend(newCard); // Add new card to the beginning of the list

  closeModal(newPostModal);
  evt.target.reset();
}

// Event listeners for modals
profileEditButton.addEventListener("click", () =>
  openModal("edit-profile-modal")
);
newPostButton.addEventListener("click", () => openModal("new-post-modal"));

modals.forEach((modal) => {
  modal
    .querySelector(".modal__close-btn")
    .addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", handleClickOutsideModal);
});

// Form submissions
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
newPostFormElement.addEventListener("submit", handleNewPostFormSubmit);

// Render cards when DOM is loaded
document.addEventListener("DOMContentLoaded", renderCards);
