const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const previewModal = document.querySelector("#preview-modal");
const modalFigure = previewModal?.querySelector(".modal__figure");
const modalImage = modalFigure?.querySelector(".modal__image");
const modalCaption = modalFigure?.querySelector(".modal__caption");
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
const closeBtns = document.querySelectorAll(".modal__close-btn");

const initialCards = [
  {
    name: "Val Thorens",
    link: "  https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
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

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector("li").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-btn_liked");
  });

  cardImage.addEventListener("click", () =>
    openImageModal(data.link, data.name)
  );

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    cardElement.remove();
  });

  return cardElement;
}

function openImageModal(imageUrl, imageCaption) {
  if (!previewModal || !modalFigure || !modalImage || !modalCaption) {
    console.error("Modal or its components not found");
    return;
  }

  modalImage.src = imageUrl;
  modalImage.alt = imageCaption;
  modalCaption.textContent = imageCaption;

  openPopup(previewModal);
}

function openPopup(popup) {
  popup.classList.add("modal_opened");
}

function closePopup(popup) {
  popup.classList.remove("modal_opened");
}

function handleClickOutsideModal(e) {
  if (e.target.classList.contains("modal")) {
    closePopup(e.target);
  }
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);

  if (method === "prepend") {
    cardList.prepend(cardElement);
  } else {
    cardList.appendChild(cardElement);
  }
}

function renderCards() {
  initialCards.forEach((cardData) => {
    renderCard(cardData, "appendChild");
  });
}

function openModal(modal) {
  openPopup(modal);
  modal.addEventListener("click", handleClickOutsideModal);
}

function addNewCard(name, link) {
  if (name && link) {
    const newCardData = { name, link };
    renderCard(newCardData);
  }
}

function populateProfileForm() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const modal = form.closest(".modal");
  form.reset();
  if (modal) closePopup(modal);
}

function handleProfileFormSubmit(evt) {
  const name = nameInput.value.trim();
  const job = jobInput.value.trim();
  if (name && job) {
    profileNameElement.textContent = name;
    profileJobElement.textContent = job;
  }
  handleSubmit(evt);
}

function handleCardFormSubmit(evt) {
  if (imageUrlInput && captionInput) {
    const imageUrl = imageUrlInput.value.trim();
    const caption = captionInput.value.trim();

    if (imageUrl && caption) {
      addNewCard(caption, imageUrl);
    }
  }

  handleSubmit(evt);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCards();

  profileEditBtn.addEventListener("click", () => {
    populateProfileForm();
    openModal(editProfileModal);
  });

  profileAddBtn.addEventListener("click", () => openModal(newPostModal));

  editProfileForm.addEventListener("submit", handleProfileFormSubmit);
  newPostForm.addEventListener("submit", handleCardFormSubmit);

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => closePopup(btn.closest(".modal")));
  });
});
