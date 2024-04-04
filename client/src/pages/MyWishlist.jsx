import React from 'react';
import '../App.css'

export default function MyWishlist() {
  return (
    <div>MyWishlist</div>
  )
}


// const MyWishlist = () => {
  // const [foodWishlist, setFoodWishlist] = useState([]);
  // const [techWishlist, setTechWishlist] = useState([]);
  // const [accessoriesWishlist, setAccessoriesWishlist] = useState([]);
  // const [clothingWishlist, setClothingWishlist] = useState([]);
  // const [artWishlist, setArtWishlist] = useState([]);

  // Function to add items to the wishlist based on category
  // const addToWishlist = (category, item) => {
  //   switch (category) {
  //     case 'Food':
  //       setFoodWishlist([...foodWishlist, item]);
  //       break;
  //     case 'Tech':
  //       setTechWishlist([...techWishlist, item]);
  //       break;
  //     case 'Accessories':
  //       setAccessoriesWishlist([...accessoriesWishlist, item]);
  //       break;
  //     case 'Clothing':
  //       setClothingWishlist([...clothingWishlist, item]);
  //       break;
  //     case 'Art':
  //       setArtWishlist([...artWishlist, item]);
  //       break;
  //     default:
  //       break;
  //   }
  // };

//   return (
//     <div className="container py-5">
//       <h1 className="text-center mb-4">My Wishlist</h1>
//       <div className="row g-4">
//         {/* Food Wishlist */}
//         <div className="col-md-6">
//           <h2>Food Wishlist</h2>
//           <div className="image-list">
//             {foodWishlist.map((item, index) => (
//               <div key={index} className="image-item">
//                 <img src={`food_images/${item}.jpg`} alt={item} />
//                 <p>{item}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tech Wishlist */}
//         <div className="col-md-6">
//           <h2>Tech Wishlist</h2>
//           <div className="image-list">
//             {techWishlist.map((item, index) => (
//               <div key={index} className="image-item">
//                 <img src={`tech_images/${item}.jpg`} alt={item} />
//                 <p>{item}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Accessories Wishlist */}
//         <div className="col-md-6">
//           <h2>Accessories Wishlist</h2>
//           <div className="image-list">
//             {accessoriesWishlist.map((item, index) => (
//               <div key={index} className="image-item">
//                 <img src={`accessories_images/${item}.jpg`} alt={item} />
//                 <p>{item}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Clothing Wishlist */}
//         <div className="col-md-6">
//           <h2>Clothing Wishlist</h2>
//           <div className="image-list">
//             {clothingWishlist.map((item, index) => (
//               <div key={index} className="image-item">
//                 <img src={`clothing_images/${item}.jpg`} alt={item} />
//                 <p>{item}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Art Wishlist */}
//         <div className="col-md-6">
//           <h2>Art Wishlist</h2>
//           <div className="image-list">
//             {artWishlist.map((item, index) => (
//               <div key={index} className="image-item">
//                 <img src={`art_images/${item}.jpg`} alt={item} />
//                 <p>{item}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyWishlist;
