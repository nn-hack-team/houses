import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { toast } from 'react-toastify'

import Slider from '../components/Slider'
import ListingItem from '../components/ListingItem'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

import { DATA_LOADING_ERROR } from '../consts'

function Explore() {
  const auth = getAuth()

  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const data = await fetch(`/api/houses/pagination/0/10?liked_by=${auth.currentUser.uid}`)
          .then(response => response.json())

        setListings(data)
        setLoading(false)
      } catch (error) {
        toast.error(DATA_LOADING_ERROR)
      }
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>вМесте</p>
      </header>

      <main>
        <Slider />
        <p className='exploreCategoryHeading'>Категории</p>
        <div className='exploreCategories'>
          <Link to='/category/rent'>
            <img
              src={rentCategoryImage}
              alt='rent'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Недвижимость для аренды</p>
          </Link>
          <Link to='/category/sale'>
            <img
              src={sellCategoryImage}
              alt='sell'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Недвижимость для продажи</p>
          </Link>
        </div>
        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Избранное</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  id={listing.id}
                />
              ))}
            </ul>
          </>
        )}
        <div className="spanBox"></div>
      </main>
    </div>
  )
}

export default Explore
