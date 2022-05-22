import { Link } from 'react-router-dom'

import Slider from '../components/Slider'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function SimpleExplore() {

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
        <div className="spanBox"></div>
      </main>
    </div>
  )
}

export default SimpleExplore
