import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import Spinner from './Spinner'
import Price from './Price'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const data = await fetch('/api/houses/pagination/995/1000')
        .then(response => response.json())

      setListings(data)
      setLoading(false)
    }

    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }

  return (
    listings && (
      <>
        <p className='exploreHeading'>Рекомендации</p>

        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map(listing => (
            <SwiperSlide
              key={listing.id}
              onClick={() => navigate(`/category/${listing.type}/${listing.id}`)}
            >
              <div
                style={{
                  background: `url(${listing.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='swiperSlideDiv'
              >
                <p className='swiperSlideText'>{listing.name}</p>
                <p className='swiperSlidePrice'>
                  <Price price={listing.price} type={listing.type}/>
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
