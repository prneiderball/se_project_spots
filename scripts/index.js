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
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikedBtn = cardElement.querySelector(".card__like-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-btn_liked");
  });

  cardImage.addEventListener("click", () =>
    openImageModal(data.link, data.name)
  );

  return cardElement;
}

function openImageModal(imageUrl, imageCaption) {
  const imageModal = document.querySelector("#image-preview-modal");
  const modalImage = imageModal.querySelector(".modal__image");
  const modalCaption = imageModal.querySelector(".modal__caption");

  modalImage.src = imageUrl;
  modalImage.alt = imageCaption;
  modalCaption.textContent = imageCaption;

  imageModal.classList.add("modal_opened");
  imageModal.addEventListener("click", handleClickOutsideModal);
  imageModal
    .querySelector(".modal__close-btn")
    .addEventListener("click", () => closeModal(imageModal));
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
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

document.addEventListener("DOMContentLoaded", renderCards);
