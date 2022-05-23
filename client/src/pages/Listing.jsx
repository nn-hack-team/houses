import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { getAuth } from 'firebase/auth'
import Spinner from '../components/Spinner'
import Price from '../components/Price'
import shareIcon from '../assets/svg/shareIcon.svg'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  const [liked, setLiked] = useState(false)


  const fetchListing = async () => {
    const data = await fetch(`/api/houses/${params.listingId}`)
      .then(response => response.json())

    setListing(data)
    setLiked(data.likedBy.includes(auth.currentUser?.uid))
    setLoading(false)
  }

  useEffect(() => {
    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }

  const onLike = async (e) => {
    if (!!auth.currentUser?.uid) {
      setLiked(!liked)
      const ans = await fetch(`/api/like/${liked ? 'remove' : 'add'}/${params.listingId}/${auth.currentUser?.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
    fetchListing()
    }
  }

  console.log(listing)

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 3000)
        }}
      >
        <img src={shareIcon} alt='' />
      </div>
      {auth.currentUser?.uid && (
        <div
          className='likeIconDiv'
          onClick={onLike}
        >
          {liked ? <FavoriteIcon className={'likeIcon'}/> : <FavoriteBorderIcon />}
          {listing.likes > 0 && <span className={'likeText'}>{listing.likes}</span>}
        </div>
      )}

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name}
          {" - "}
          <Price price={listing.price} type={listing.type} />
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          Для {listing.type === 'rent' ? 'аренды' : 'продажи'}
        </p>

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Спален`
              : '1 Спальня'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Ванные`
              : '1 Ванная'}
          </li>
          <li>{parseInt(listing.floor)} этаж</li>
          <li>{listing.parking && 'Есть парковочное место'}</li>
          <li>{listing.furnished && 'С мебелью'}</li>
          {listing.subway_dist < 5 && <li>До метро ~ {parseInt(listing.subway_dist * 10) / 10} км</li> }
          
        </ul>

        <p className='listingLocationTitle'>Расположение</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.lat, listing.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.lat, listing.lng]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {listing.userRef !== 'none' && // auth.currentUser?.uid !== listing.owner && 
        (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing