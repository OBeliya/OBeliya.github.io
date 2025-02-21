// Gather references to all the card elements
// We now have 8 cards in total (card0 through card7)
const cards = [
  document.getElementById('card9'),
  document.getElementById('card0'),
  document.getElementById('card1'),
  document.getElementById('card2'),
  document.getElementById('card3'),
  document.getElementById('card4'),
  document.getElementById('card5'),
  document.getElementById('card6'),
  document.getElementById('card7'),
  document.getElementById('card8'),
  document.getElementById('card10'),
];

// We'll show them in sequence using 'currentIndex'
let currentIndex = 0;

// Function to update the zIndex and display of each card
function updateZIndices() {
  cards.forEach((card, i) => {
    if (i < currentIndex) {
      // "behind" or already swiped
      card.style.zIndex = 0;
      card.style.display = 'none';
    } else if (i === currentIndex) {
      // the top card
      card.style.zIndex = 2;
      card.style.display = 'block';
    } else {
      // future cards, hidden behind
      card.style.zIndex = 1;
      card.style.display = 'none';
    }
  });
}

// Initialize
updateZIndices();

// We'll track whether the user is currently dragging
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let currentRotate = 0;

// Pointer down (mouse or touch)
function onPointerDown(x, y) {
  if (currentIndex < 0 || currentIndex >= cards.length) return;
  isDragging = true;
  startX = x;
  startY = y;
}

// Pointer move
function onPointerMove(x, y) {
  if (!isDragging) return;
  if (currentIndex < 0 || currentIndex >= cards.length) return;

  const dx = x - startX;
  const dy = y - startY;
  currentX = dx;
  currentY = dy;
  // Rotate a little based on horizontal distance
  currentRotate = dx * 0.05;

  // Update transform on the current card
  const card = cards[currentIndex];
  card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotate}deg)`;
}

// Pointer up
function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;

  if (currentIndex < 0 || currentIndex >= cards.length) return;
  const card = cards[currentIndex];

  // Check horizontal swipe distance
  if (currentX < -100) {
    // Swiped left -> go to NEXT card
    card.style.transform = `translate(${currentX - 200}px, ${currentY}px) rotate(${currentRotate - 20}deg)`;
    setTimeout(() => {
      currentIndex++;
      if (currentIndex >= cards.length) {
        currentIndex = cards.length - 1;
      }
      resetTransform();
      updateZIndices();
    }, 200);
  } else if (currentX > 100) {
    // Swiped right -> go to PREVIOUS card
    card.style.transform = `translate(${currentX + 200}px, ${currentY}px) rotate(${currentRotate + 20}deg)`;
    setTimeout(() => {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = 0;
      }
      resetTransform();
      updateZIndices();
    }, 200);
  } else {
    // Not swiped far enough -> snap back
    card.style.transform = 'translate(0px, 0px) rotate(0deg)';
  }
}

// Reset transform helper
function resetTransform() {
  currentX = 0;
  currentY = 0;
  currentRotate = 0;
  // The new top card snaps back to center
  if (currentIndex >= 0 && currentIndex < cards.length) {
    cards[currentIndex].style.transform = 'translate(0px, 0px) rotate(0deg)';
  }
}

// MOUSE EVENTS
window.addEventListener('mousedown', (e) => {
  onPointerDown(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => {
  onPointerMove(e.clientX, e.clientY);
});
window.addEventListener('mouseup', () => {
  onPointerUp();
});

// TOUCH EVENTS
window.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  onPointerDown(touch.clientX, touch.clientY);
});
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  onPointerMove(touch.clientX, touch.clientY);
});
window.addEventListener('touchend', () => {
  onPointerUp();
});
