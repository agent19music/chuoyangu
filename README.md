# CHUO YANGU

# Table of Contents
* Introduction
* Description
* Installation
* Known Bugs
* Technologies used
* License

## Introduction

- In this project flask and python was used to create the back-end.
- Javascript and React for the front-end.
- Styling was done using css, bootsrap, sweetalert among others.

## Description

In today's fast-paced world, effective communication is essential for success in various aspects of life, including personal relationships, professional endeavors, and social interactions. However, despite the advancements in technology, many students in universities, colleges or schools still struggle with communication issues that hinder their productivity, collaboration, and overall well-being.**CHUO YANGU** comes in to attempt to solve the problem of communication by bringing information much closer to the student/s in a fast, efficient and reliable manner. 

A user can:
  - A user can sign up to create an account.
  - Log-in into their account. 
  - Reset their password.
  - Update the information on their profile.
  - View all posted events. 
  - Comment on a posted event .
  - Post an event.
  - Edit the event they posted.
  - Delete the event they posted.
  - View all Fun-Times that have been posted.
  - Like a specific Fun-Time.
  - Comment on a specific Fun-Time.
  - Post a Fun-Time.
  - Edit the Fun-Time they posted.
  - Delete the Fun-Time they posted.
  - View all products being sold.
  - Star a specific product for future reference.
  - Post a product .
  - Edit the information about the product they posted.
  - Delete the product they posted.


## Models

The file `server/models.py` defines the model classes and its relationships**.
Use the following commands to create the initial database `test.db`:

```console
flask db upgrade 
```

The following relationships are implemented:
- `Users <-> Events`: One-to-Many relationship. A user can organize many events, but each event is associated with only one user. 
- `Users <-> Products`: One-to-Many relationship. A user can list many products for sale, but each product is associated with only one user. 
- `Users <-> Comment_events`: One-to-Many relationship. A user can comment on many events, but each comment is associated with only one user. 
- `Users <-> Comment_fun_times`: One-to-Many relationship. A user can comment on many fun times, but each comment is associated with only one user. 
- `Users <-> Reviews`: One-to-Many relationship. A user can review many products, but each review is associated with only one user. 
- `Users <-> Wishlists`: One-to-Many relationship. A user can have many products in their wishlist, but each wishlist item is associated with only one user. 
- `Events <-> Comment_events`: One-to-Many relationship. An event can have many comments, but each comment is associated with only one event.
- `Products <-> Reviews`: One-to-Many relationship. A product can have many reviews, but each review is associated with only one product.
- `Fun_times <-> Comment_fun_times`: One-to-Many relationship. A fun time activity can have many comments, but each comment is associated with only one fun time activity.
- `Fun_times <-> Likes`: One-to-Many relationship. A fun time activity can have many likes, but each like is associated with only one fun time activity.


You can seed the database:

```console
python server/seed.py
```

> If you aren't able to get the provided seed file working, you are welcome to
> generate your own seed data to test the application.


## Routes

The following are the routes used within the application. 

![routes](/client/images/1.image.png)

![routes](/client/images/2.image.png)

![routes](/client/images/3.image.png)


## Set Up/ Installation 
- Clone the repository or download the source code.
- Make sure you have python or python3 installed on your system.
- Open the cloned folder with vscode.
To download the dependencies for the frontend and backend, run:

```console
pipenv install -- prefix server
pipenv shell
npm install --prefix client
```

You can run your Flask API on [`localhost:5000`](http://localhost:5000) by
running:

```console
python server/app.py --prefix server
```

You can run your React app on [`localhost:4000`](http://localhost:5173) by
running:

```sh
npm run dev --prefix client
```

**Ensure your internet connection is stable to facilitate the download of the source code**


## Known Bugs
The application works well.

## Technologies used
- Terminal
- Python
- Flask
- JavaScript
- React
- Vite

# License
This project is licensed under the MIT License.
