import React from 'react'
import { ArrowRight } from 'lucide-react'
import { FEATURES } from '../../utils/data'

const Features = () => {
  return (
    <section className=''>
        <div className=''>
            <div className=''>
                <h2 className=''>Powerful features to run your business</h2>
                <p className=''>Everything you need to manage you invoicing and get paid</p>
            </div>

            <div className=''>
                {FEATURES.map((feature, index) => (<div key={index} className=''>
                    <div className=''><feature.icon className=''/></div>
                    <h3 className=''>{feature.title}</h3>
                    <p className=''>{feature.description}</p>
                    <a className='' href='#'>Learn More <ArrowRight className=''/></a>
                </div>))}
            </div>
        </div>
    </section>
  )
}

export default Features
