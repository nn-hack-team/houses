import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner'

function CreateListing() {
  const geolocationEnabled = true
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    floor: 1,
    address: '',
    price: 0,
    images: {},
    lat: 0,
    lng: 0,
    total_square: 50
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    floor,
    address,
    price,
    images,
    lat,
    lng,
    total_square
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (images.length > 6) {
      setLoading(false)
      toast.error('Максимум 6 изображений')
      return
    }

    let geolocation = {}
    let location

    if (geolocationEnabled) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search.php?q=${address}&format=jsonv2`
      )

      const data = await response.json()

      geolocation.lat = data[0]?.lat ?? 0
      geolocation.lng = data[0]?.lon ?? 0

      location =
        data === []
          ? undefined
          : data[0]?.display_name

      if (location === undefined || location.includes('undefined')) {
        setLoading(false)
        toast.error('Пожалуйста введите корректный адресс')
        return
      }
    } else {
      geolocation.lat = lat
      geolocation.lng = lng
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Не удалось загрузить изображения')
      return
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      lat: geolocation.lat,
      lng: geolocation.lng,
      // timestamp: serverTimestamp(),
    }

    // formDataCopy.location = address
    delete formDataCopy.images
    // delete formDataCopy.address
    // !formDataCopy.offer && delete formDataCopy.discountedPrice

    const add_answer = await fetch('/api/houses', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataCopy)
    })
      .then(response => response.json())

    setLoading(false)
    toast.success('Listing saved')
    navigate(`/category/${formDataCopy.type}/${add_answer.item_ref}`)
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Создать объявление</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Продать / сдать</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Продать
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Сдать
            </button>
          </div>

          <label className='formLabel'>Название</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='64'
            minLength='4'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Спальни</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='0'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Ванные</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='0'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Этаж</label>
              <input
                className='formInputSmall'
                type='number'
                id='floor'
                value={floor}
                onChange={onMutate}
                min='-5'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Парковка</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Да
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              Нет
            </button>
          </div>

          <label className='formLabel'>С мебелью</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Да
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              Нет
            </button>
          </div>

          <label className='formLabel'>Адрес</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Широта</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='lat'
                  value={lat}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Долгота</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='lng'
                  value={lng}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Цена</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='price'
              value={price}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
              <p className='formPriceText'>руб {type === 'rent' && " / месяц"}</p>
          </div>

          <label className='formLabel'>Площадь</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='total_square'
              value={total_square}
              onChange={onMutate}
              min='1'
              max='10000000'
              required
            />
              <p className='formPriceText'>метров квадратных</p>
          </div>

          <label className='formLabel'>Изображения</label>
          <p className='imagesInfo'>
            Первое изображение будет обложкой (максимум 6)
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Разместить объявление
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing
