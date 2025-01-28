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

const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

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
  const previewModal = document.querySelector("#preview-modal");
  if (!previewModal) {
    console.error("Preview Modal not found");
    return;
  }

  const modalFigure = previewModal.querySelector(".modal__figure");
  if (!modalFigure) {
    console.error("Modal figure not found");
    return;
  }

  const modalImage = modalFigure.querySelector(".modal__image");
  const modalCaption = modalFigure.querySelector(".modal__caption");

  if (modalImage && modalCaption) {
    modalImage.src = imageUrl;
    modalImage.alt = imageCaption;
    modalCaption.textContent = imageCaption;

    previewModal.classList.add("modal_opened");
    previewModal.addEventListener("click", handleClickOutsideModal);
    const closeBtn = previewModal.querySelector(".modal__close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(previewModal));
    }
  } else {
    console.error("Modal image or caption not found");
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleClickOutsideModal);
}

function handleClickOutsideModal(e) {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target);
  }
}

function renderCards() {
  cardList.innerHTML = "";
  initialCards.forEach((cardData) => {
    const card = getCardElement(cardData);
    cardList.appendChild(card);
  });
}

function openModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);
  if (modal) {
    modal.classList.add("modal_opened");
    modal.addEventListener("click", handleClickOutsideModal);
    const closeBtn = modal.querySelector(".modal__close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(modal));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCards();

  document
    .querySelector(".profile__edit-btn")
    .addEventListener("click", () => openModal("edit-profile-modal"));
  document
    .querySelector(".profile__add-btn")
    .addEventListener("click", () => openModal("new-post-modal"));
});
