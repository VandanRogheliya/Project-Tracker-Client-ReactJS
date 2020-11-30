<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://vproject-t.herokuapp.com">
    <img src="src/assets/img/brand/logo-blue-3.png" alt="Logo" width="310">
  </a>

  <h3 align="center">Project Tracker</h3>

  <p align="center">
    A bug tracker
    <br />
    <br />
    <a href="https://vproject-t.herokuapp.com">Visit site</a>
    ·
    <a href="https://github.com/VandanRogheliya/Project-Tracker-Client-ReactJS">Client Repo</a>
    ·
    <a href="https://github.com/VandanRogheliya/Project-Tracker-API-ExpressJS">API Repo</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#roles-in-detail">Roles in Detail</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#repositories">Repositories</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
  <img src="src/assets/img/screenshots/landing.png" alt="Landing page" width="100%">
</p>

Project Tracker is a web application that helps to track bugs in projects. Users around the globe can collaborate on multiple projects and make them better.

### Features

 * **OAuth2 Authentication**: Users can use their GitHub or Google account to authenticate

 * **Opening new issues**: Add description, deadline, tags, links, status, assignee and reviewer.
 
 * **Managing Projects**: Make your organization to group all your projects.

 * **Roles**: Each org will have creator, admins and members. [Click here to know more](#roles-in-detail).
 
 * **Add Projects**:  Add projects to an organization, mention tools and technologies required to build it.
 
 * **Commenting on issues**
 
 * **Managing Roles**: Admins and higher can demote, promote and kick other lower roles. Admins and higher can invite other users to the organization or other users can request to join.
 
 * **Dashboard**: Access all bugs you have interacted which are categorized accordingly. Also, access all the organizations you are part of.

 * **Account Management**: Change username, first name, last name, email and profile picture.

 * **Searching**: Issues, Projects, Organizations and Users 
 
 * **Works on all screens sizes**

 * **Editing And Deleting**: Issues, Projects, Organizations and Comments can be edited or deleted after uploading

### Roles in Detail

The level of access each user has in an organization depends on his/her role. He/she can either be member, admin or creator.

Levels of access in decreasing order are:

1. Creator
2. Admin
3. Member
4. Non-member

 * **Non-member**: can view all the content of the org but can not interact. He/She can be added to org or can send a request.

 * **Member**: can send issues for approval and comment on issues

 * **Admin**: can add issues, approve issues, open new projects, promote members to admin, demote other admins to members, kick members and admins, add non-members to organization, approve or deny requests to join organization, edit and delete issues and projects and edit organization description.

 * **Creator**: can not be kicked by any other user and can delete organization.  

 Access level of all lower roles is included in higher one. For example, admin can do whatever a member can do.

### Built With

* [ExpressJS](https://expressjs.com/)
* [NodeJS](https://nodejs.org/en/)
* [PassportJS](http://www.passportjs.org/)
* [MongoDB](https://www.mongodb.com/)
* [ReactJS](https://reactjs.org/)
* [React Router](https://reactrouter.com/)
* [Bootstrap](https://getbootstrap.com/)


<!-- USAGE EXAMPLES -->
## Usage

`Pending`


<!-- CONTACT -->
## Contact

LinkedIn - [Vandan Rogheliya](https://www.linkedin.com/in/vandanrogheliya/) - rogheliavandan@outlook.com

<!-- REPOSITORIES -->
## Repositories
Client Repository: [https://github.com/VandanRogheliya/Project-Tracker-Client-ReactJS](https://github.com/VandanRogheliya/Project-Tracker-Client-ReactJS)

API Repository: [https://github.com/VandanRogheliya/Project-Tracker-API-ExpressJS](https://github.com/VandanRogheliya/Project-Tracker-API-ExpressJS)
