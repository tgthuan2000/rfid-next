import clsx from 'clsx'
import { HomeIcon, TemplateIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import { SLUG } from 'constants/slug'
import { useRouter } from 'next/router'

const navigation = [
	{ name: 'Trang chủ', href: SLUG.DASHBOARD, icon: HomeIcon },
	{ name: 'Quản lý sản phẩm', href: SLUG.PRODUCT, icon: TemplateIcon },
]

const Layout = ({ children }) => {
	const router = useRouter()

	return (
		<div>
			<div className='hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0'>
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className='flex flex-col flex-grow pt-5 bg-gray-800 overflow-y-auto'>
					{/* Logo */}
					<div className='flex mt-5 items-center flex-shrink-0 px-4'>
						{/* <Image
							src='https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg'
							alt='Workflow'
							layout='fixed'
							height={32}
							width={150}
						/> */}
					</div>
					{/* Logo */}
					<div className='mt-14 flex-1 flex flex-col'>
						<nav className='flex-1 px-2 pb-4 space-y-1'>
							{navigation.map((item) => (
								<Link key={item.name} href={item.href}>
									<a
										className={clsx(
											router.asPath.includes(item.href)
												? 'bg-gray-700 text-white font-semibold'
												: 'text-gray-100 hover:bg-gray-600 font-medium',
											'group flex items-center px-2 py-2 text-sm rounded-md'
										)}
									>
										<item.icon
											className='mr-3 flex-shrink-0 h-6 w-6 text-gray-300'
											aria-hidden='true'
										/>
										{item.name}
									</a>
								</Link>
							))}
						</nav>
					</div>
				</div>
			</div>
			<div className='md:pl-64 flex flex-col flex-1 min-h-screen'>
				<main className='bg-gray-100 flex-1'>
					<div className='py-6'>
						<div className='px-4 sm:px-6 md:px-8'>
							{/* Replace with your content */}
							<div className='py-4'>{children}</div>
							{/* /End replace */}
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}

export default Layout
