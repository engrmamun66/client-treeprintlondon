<script setup>
 

onMounted(() => {
  const menuLinks = document.querySelectorAll(".menu-link");

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuLinks.forEach((link) => {
        link.classList.remove("is-active");
      });
      link.classList.add("is-active");
    });
  });

 

})

</script>

<template>
    <header class="header" id="header">
        <nav class="navbar container">
            <a href="./index.html" class="brand">Brand</a>
            <div class="menu" id="menu">
                <ul class="menu-list">
                    <li class="menu-item">
                        <a href="#" class="menu-link is-active">
                            <i class="menu-icon ion-md-home"></i>
                            <span class="menu-name">Home</span>
                        </a>
                    </li> 
                    <li class="menu-item">
                        <a href="#" class="menu-link">
                            <i class="menu-icon ion-md-search"></i>
                            <span class="menu-name">Search</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="#" class="menu-link">
                            <i class="menu-icon ion-md-cart"></i>
                            <span class="menu-name">Cart</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="#" class="menu-link">
                            <i class="menu-icon ion-md-heart"></i>
                            <span class="menu-name">Favorite</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="#" class="menu-link">
                            <i class="menu-icon ion-md-contact"></i>
                            <span class="menu-name">Account</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<style scoped> 
header {
  --color-black: hsl(0, 0%, 10%);
  --color-white: hsl(0, 0%, 100%);
  --color-darken: hsl(0, 0%, 20%);
  --color-teal: hsl(159, 91%, 4%);
  --color-teal-200: hsl(161, 94%, 6%);
  --shadow-medium: 0 -4px 6px -1px rgba(0, 0, 0, 0.1),
  	0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
  	0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

 
 
a,
button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  text-decoration: none;
}

img,
video {
  display: block;
  max-width: 100%;
  height: auto;
  -o-object-fit: cover;
     object-fit: cover;
}

ul{
  margin-bottom: 0px;
}

.container {
  max-width: 75rem;
  height: auto;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.brand {
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-teal);
  text-transform: uppercase;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 100;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  margin: 0 auto;
}

.menu {
  position: fixed;
  left: 0;
  bottom: 0;
  display: grid;
  align-content: center;
  width: 100%;
  height: 3.5rem;
  padding: 0 1rem;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  background: var(--color-white);
  box-shadow: var(--shadow-medium);
}
.menu-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.menu-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  color: var(--color-black);
}
.menu-link.is-active {
  position: relative;
  color: var(--color-teal);
  transition: all 0.35s ease;
}
.menu-icon {
  font-size: 1.35rem;
  line-height: 1;
  color: inherit;
}
.menu-name {
  display: none;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  visibility: hidden;
  text-transform: capitalize;
}

@media only screen and (min-width: 360px) {
  .menu-name {
    display: block;
    visibility: visible;
  }
}
@media only screen and (min-width: 576px) {
  .menu-list {
    justify-content: center;
    -moz-column-gap: 3rem;
         column-gap: 3rem;
  }
}
@media only screen and (min-width: 768px) {
  .header {
    background: var(--color-white);
    box-shadow: var(--shadow-medium);
    transition: all 0.35s ease-in-out;
  }

  .menu {
    position: relative;
    top: 0;
    right: 0;
    width: auto;
    height: auto;
    background: none;
    box-shadow: none;
  }
  .menu-link.is-active::before {
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    border: none;
    outline: none;
    background: var(--color-teal);
  }
  .menu-link:hover {
    color: var(--color-teal);
    transition: all 0.35s ease;
  }
  .menu-icon {
    display: none;
    visibility: hidden;
  }
  .menu-name {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 0.2rem;
  }
}
</style>
