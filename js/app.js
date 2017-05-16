$(".js-add-details-item").click(function() {

  var detailsItemInput = $(".add-form-details-container > li:first")
  .clone();

  $("input", detailsItemInput).val("");

  $(".add-form-details-container")
    .append(detailsItemInput);
});

$("#add-new-book").submit(function(e) {
  e.preventDefault();

  var formData = $(this).serializeArray();

  var book = {
    details: []
  };

  $(formData).each(function(index, item) {

    if (item.name === "details[][title]" && item.value != "") {

      // Next item is always the value
      var detailsValue = formData[index + 1];

      book.details.push({
        label: item.value,
        value: detailsValue.value,
      });

    } else if (item.name !== "details[][value]") {
      book[item.name] = item.value;
    }
  });

  // Get current library state
  var library = JSON.parse(localStorage.getItem("library"));

  library.push(book);

  // Update local storage
  localStorage.setItem("library", JSON.stringify(library));

  // Update the collection view
  renderCollectionView(library);

  // Clear add book form
  $("#add-new-book input, #add-new-book textarea")
    .val("");

  var detailsItemInput = $(".add-form-details-container > li:first")
  .clone();

  $(".add-form-details-container")
    .empty()
    .append(detailsItemInput);
});

function deleteBookHandler(bookId) {

  // Get the current library
  var library = JSON.parse(localStorage.getItem("library"));

  // Remove the deleted book
  library = library.filter(function(item, index) {
    return index != bookId;
  });

  // Update the library
  localStorage.setItem("library", JSON.stringify(library));

  // Re-render the page
  renderPage();
}

function renderDetailViewItem(bookId, book) {

  // Scroll to the top of the page
  $("body").scrollTop(0);

  // Remove active class from old book
  $(".book").removeClass("active");

  // No book found, let them know
  if (!book) {
    $("#book-detail-container")
      .empty()
      .text("No Book Selected");
    return;
  }

  // Apply active class to selected book
  $("#book-" + bookId).addClass("active");

  // Render details title section
  var detailsTitle = $("<div>")
    .addClass("row")
    .append($("<div>")
      .addClass("col-lg-12")
      .append($("<h1>")
        .addClass("page-header")
        .text(book.title)
        .append($("<small>").text(book.author))
        .append($("<button>")
        .addClass("btn btn-danger pull-right")
        .text("Delete")
        .click(deleteBookHandler.bind(null, bookId)))
      ));

  // Render details image section
  var detailsImage = $("<div>")
    .addClass("col-md-4")
    .append($("<img>")
      .addClass("img-responsive cover-image")
      .attr("src", book.image)
      .attr("alt", book.title + " cover"));

  // Render book details
  var detailsList = $("<ul>");
  $(book.details).each(function(index, item) {
    detailsList.append($("<li>")
      .addClass("detail-list-item")
      .append($("<strong>").text(item.label + ":"))
      .append($("<span>").text(item.value)));
  });

  // Render book description
  var detailsDescription = $("<div>")
    .addClass("col-md-8")
    .append($("<h3>").text("Description"))
    .append($("<p>").text(book.description))
    .append($("<h3>").text("Details"))
    .append(detailsList);

  $("#book-detail-container")
    .empty()
    .append(detailsTitle)
    .append($("<div>")
      .addClass("row")
      .append(detailsImage)
      .append(detailsDescription));
}

function renderCollectionViewItem(bookId, book) {
  return $("<div>")
    .attr("id", "book-" + bookId)
    .addClass("col-lg-3 col-md-4 col-sm-6 col-xs-12 book")
    .append($("<a>")
      .addClass("book-item-container")
      .append($("<img>")
        .addClass("portfolio-item")
        .attr("src", book.image)
        .attr("alt", "Book Cover Image")
      )
      .append($("<h4>").text(book.title))
    )
    .click(renderDetailViewItem.bind(null, bookId, book));
}

function renderCollectionView(library) {
  $("#related-books-container").empty();
  $.each(library, function(bookId, book) {
    $("#related-books-container")
      .append(renderCollectionViewItem(bookId, book));
  });
}

function renderPage() {
  // Get all books in library
  var library = JSON.parse(localStorage.getItem("library"));

  // Render list of books
  renderCollectionView(library);

  // Render details for the first book
  renderDetailViewItem(0, library[0]);
}

renderPage();
