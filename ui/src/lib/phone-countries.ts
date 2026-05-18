export interface PhoneCountry {
  iso2: string
  name: string
  dialCode: string
  nationalNumberLengths?: number[]
  nationalNumberPattern?: RegExp
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso2: 'AF', name: 'Afghanistan', dialCode: '+93', nationalNumberLengths: [9] },
  { iso2: 'AX', name: 'Aland Islands', dialCode: '+358', nationalNumberLengths: [5, 6, 7, 8, 9, 10, 11, 12] },
  { iso2: 'AL', name: 'Albania', dialCode: '+355', nationalNumberLengths: [8, 9] },
  { iso2: 'DZ', name: 'Algeria', dialCode: '+213', nationalNumberLengths: [8, 9] },
  { iso2: 'AS', name: 'American Samoa', dialCode: '+1684', nationalNumberLengths: [10] },
  { iso2: 'AD', name: 'Andorra', dialCode: '+376', nationalNumberLengths: [6] },
  { iso2: 'AO', name: 'Angola', dialCode: '+244', nationalNumberLengths: [9] },
  { iso2: 'AI', name: 'Anguilla', dialCode: '+1264', nationalNumberLengths: [10] },
  { iso2: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', nationalNumberLengths: [10] },
  { iso2: 'AR', name: 'Argentina', dialCode: '+54', nationalNumberLengths: [10] },
  { iso2: 'AM', name: 'Armenia', dialCode: '+374', nationalNumberLengths: [8] },
  { iso2: 'AW', name: 'Aruba', dialCode: '+297', nationalNumberLengths: [7] },
  { iso2: 'AU', name: 'Australia', dialCode: '+61', nationalNumberLengths: [9] },
  { iso2: 'AT', name: 'Austria', dialCode: '+43', nationalNumberLengths: [10, 11, 12, 13] },
  { iso2: 'AZ', name: 'Azerbaijan', dialCode: '+994', nationalNumberLengths: [9] },
  { iso2: 'BS', name: 'Bahamas', dialCode: '+1242', nationalNumberLengths: [10] },
  { iso2: 'BH', name: 'Bahrain', dialCode: '+973', nationalNumberLengths: [8] },
  { iso2: 'BD', name: 'Bangladesh', dialCode: '+880', nationalNumberLengths: [10] },
  { iso2: 'BB', name: 'Barbados', dialCode: '+1246', nationalNumberLengths: [10] },
  { iso2: 'BY', name: 'Belarus', dialCode: '+375', nationalNumberLengths: [9] },
  { iso2: 'BE', name: 'Belgium', dialCode: '+32', nationalNumberLengths: [8, 9] },
  { iso2: 'BZ', name: 'Belize', dialCode: '+501', nationalNumberLengths: [7] },
  { iso2: 'BJ', name: 'Benin', dialCode: '+229', nationalNumberLengths: [8, 10] },
  { iso2: 'BM', name: 'Bermuda', dialCode: '+1441', nationalNumberLengths: [10] },
  { iso2: 'BT', name: 'Bhutan', dialCode: '+975', nationalNumberLengths: [7, 8] },
  { iso2: 'BO', name: 'Bolivia', dialCode: '+591', nationalNumberLengths: [8] },
  { iso2: 'BQ', name: 'Bonaire, Sint Eustatius and Saba', dialCode: '+599', nationalNumberLengths: [7] },
  { iso2: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', nationalNumberLengths: [8] },
  { iso2: 'BW', name: 'Botswana', dialCode: '+267', nationalNumberLengths: [7, 8] },
  { iso2: 'BR', name: 'Brazil', dialCode: '+55', nationalNumberLengths: [10, 11] },
  { iso2: 'IO', name: 'British Indian Ocean Territory', dialCode: '+246', nationalNumberLengths: [7] },
  { iso2: 'VG', name: 'British Virgin Islands', dialCode: '+1284', nationalNumberLengths: [10] },
  { iso2: 'BN', name: 'Brunei', dialCode: '+673', nationalNumberLengths: [7] },
  { iso2: 'BG', name: 'Bulgaria', dialCode: '+359', nationalNumberLengths: [8, 9] },
  { iso2: 'BF', name: 'Burkina Faso', dialCode: '+226', nationalNumberLengths: [8] },
  { iso2: 'BI', name: 'Burundi', dialCode: '+257', nationalNumberLengths: [8] },
  { iso2: 'KH', name: 'Cambodia', dialCode: '+855', nationalNumberLengths: [8, 9] },
  { iso2: 'CM', name: 'Cameroon', dialCode: '+237', nationalNumberLengths: [9] },
  { iso2: 'CA', name: 'Canada', dialCode: '+1', nationalNumberLengths: [10] },
  { iso2: 'CV', name: 'Cape Verde', dialCode: '+238', nationalNumberLengths: [7] },
  { iso2: 'KY', name: 'Cayman Islands', dialCode: '+1345', nationalNumberLengths: [10] },
  { iso2: 'CF', name: 'Central African Republic', dialCode: '+236', nationalNumberLengths: [8] },
  { iso2: 'TD', name: 'Chad', dialCode: '+235', nationalNumberLengths: [8] },
  { iso2: 'CL', name: 'Chile', dialCode: '+56', nationalNumberLengths: [9] },
  { iso2: 'CN', name: 'China', dialCode: '+86', nationalNumberLengths: [11] },
  { iso2: 'CX', name: 'Christmas Island', dialCode: '+61', nationalNumberLengths: [9] },
  { iso2: 'CC', name: 'Cocos Islands', dialCode: '+61', nationalNumberLengths: [9] },
  { iso2: 'CO', name: 'Colombia', dialCode: '+57', nationalNumberLengths: [10] },
  { iso2: 'KM', name: 'Comoros', dialCode: '+269', nationalNumberLengths: [7] },
  { iso2: 'CG', name: 'Congo', dialCode: '+242', nationalNumberLengths: [9] },
  { iso2: 'CD', name: 'Congo DR', dialCode: '+243', nationalNumberLengths: [9] },
  { iso2: 'CK', name: 'Cook Islands', dialCode: '+682', nationalNumberLengths: [5] },
  { iso2: 'CR', name: 'Costa Rica', dialCode: '+506', nationalNumberLengths: [8] },
  { iso2: 'CI', name: "Cote d'Ivoire", dialCode: '+225', nationalNumberLengths: [10] },
  { iso2: 'HR', name: 'Croatia', dialCode: '+385', nationalNumberLengths: [8, 9] },
  { iso2: 'CU', name: 'Cuba', dialCode: '+53', nationalNumberLengths: [8] },
  { iso2: 'CW', name: 'Curacao', dialCode: '+599', nationalNumberLengths: [7] },
  { iso2: 'CY', name: 'Cyprus', dialCode: '+357', nationalNumberLengths: [8] },
  { iso2: 'CZ', name: 'Czech Republic', dialCode: '+420', nationalNumberLengths: [9] },
  { iso2: 'DK', name: 'Denmark', dialCode: '+45', nationalNumberLengths: [8] },
  { iso2: 'DJ', name: 'Djibouti', dialCode: '+253', nationalNumberLengths: [8] },
  { iso2: 'DM', name: 'Dominica', dialCode: '+1767', nationalNumberLengths: [10] },
  { iso2: 'DO', name: 'Dominican Republic', dialCode: '+1809', nationalNumberLengths: [10] },
  { iso2: 'DO', name: 'Dominican Republic', dialCode: '+1829', nationalNumberLengths: [10] },
  { iso2: 'DO', name: 'Dominican Republic', dialCode: '+1849', nationalNumberLengths: [10] },
  { iso2: 'EC', name: 'Ecuador', dialCode: '+593', nationalNumberLengths: [8, 9] },
  { iso2: 'EG', name: 'Egypt', dialCode: '+20', nationalNumberLengths: [10] },
  { iso2: 'SV', name: 'El Salvador', dialCode: '+503', nationalNumberLengths: [8] },
  { iso2: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', nationalNumberLengths: [9] },
  { iso2: 'ER', name: 'Eritrea', dialCode: '+291', nationalNumberLengths: [7] },
  { iso2: 'EE', name: 'Estonia', dialCode: '+372', nationalNumberLengths: [7, 8] },
  { iso2: 'SZ', name: 'Eswatini', dialCode: '+268', nationalNumberLengths: [8] },
  { iso2: 'ET', name: 'Ethiopia', dialCode: '+251', nationalNumberLengths: [9] },
  { iso2: 'FK', name: 'Falkland Islands', dialCode: '+500', nationalNumberLengths: [5] },
  { iso2: 'FO', name: 'Faroe Islands', dialCode: '+298', nationalNumberLengths: [6] },
  { iso2: 'FJ', name: 'Fiji', dialCode: '+679', nationalNumberLengths: [7] },
  { iso2: 'FI', name: 'Finland', dialCode: '+358', nationalNumberLengths: [9, 10, 11, 12] },
  { iso2: 'FR', name: 'France', dialCode: '+33', nationalNumberLengths: [9] },
  { iso2: 'GF', name: 'French Guiana', dialCode: '+594', nationalNumberLengths: [9] },
  { iso2: 'PF', name: 'French Polynesia', dialCode: '+689', nationalNumberLengths: [8] },
  { iso2: 'GA', name: 'Gabon', dialCode: '+241', nationalNumberLengths: [8] },
  { iso2: 'GM', name: 'Gambia', dialCode: '+220', nationalNumberLengths: [7] },
  { iso2: 'GE', name: 'Georgia', dialCode: '+995', nationalNumberLengths: [9] },
  { iso2: 'DE', name: 'Germany', dialCode: '+49', nationalNumberLengths: [10, 11] },
  { iso2: 'GH', name: 'Ghana', dialCode: '+233', nationalNumberLengths: [9] },
  { iso2: 'GI', name: 'Gibraltar', dialCode: '+350', nationalNumberLengths: [8] },
  { iso2: 'GR', name: 'Greece', dialCode: '+30', nationalNumberLengths: [10] },
  { iso2: 'GL', name: 'Greenland', dialCode: '+299', nationalNumberLengths: [6] },
  { iso2: 'GD', name: 'Grenada', dialCode: '+1473', nationalNumberLengths: [10] },
  { iso2: 'GP', name: 'Guadeloupe', dialCode: '+590', nationalNumberLengths: [9] },
  { iso2: 'GU', name: 'Guam', dialCode: '+1671', nationalNumberLengths: [10] },
  { iso2: 'GT', name: 'Guatemala', dialCode: '+502', nationalNumberLengths: [8] },
  { iso2: 'GG', name: 'Guernsey', dialCode: '+44', nationalNumberLengths: [10] },
  { iso2: 'GN', name: 'Guinea', dialCode: '+224', nationalNumberLengths: [9] },
  { iso2: 'GW', name: 'Guinea-Bissau', dialCode: '+245', nationalNumberLengths: [7] },
  { iso2: 'GY', name: 'Guyana', dialCode: '+592', nationalNumberLengths: [7] },
  { iso2: 'HT', name: 'Haiti', dialCode: '+509', nationalNumberLengths: [8] },
  { iso2: 'HN', name: 'Honduras', dialCode: '+504', nationalNumberLengths: [8] },
  { iso2: 'HK', name: 'Hong Kong', dialCode: '+852', nationalNumberLengths: [8] },
  { iso2: 'HU', name: 'Hungary', dialCode: '+36', nationalNumberLengths: [9] },
  { iso2: 'IS', name: 'Iceland', dialCode: '+354', nationalNumberLengths: [7] },
  { iso2: 'IN', name: 'India', dialCode: '+91', nationalNumberLengths: [10], nationalNumberPattern: /^[6-9]\d{9}$/ },
  { iso2: 'ID', name: 'Indonesia', dialCode: '+62', nationalNumberLengths: [9, 10, 11, 12] },
  { iso2: 'IR', name: 'Iran', dialCode: '+98', nationalNumberLengths: [10] },
  { iso2: 'IQ', name: 'Iraq', dialCode: '+964', nationalNumberLengths: [10] },
  { iso2: 'IE', name: 'Ireland', dialCode: '+353', nationalNumberLengths: [9] },
  { iso2: 'IM', name: 'Isle of Man', dialCode: '+44', nationalNumberLengths: [10] },
  { iso2: 'IL', name: 'Israel', dialCode: '+972', nationalNumberLengths: [9] },
  { iso2: 'IT', name: 'Italy', dialCode: '+39', nationalNumberLengths: [9, 10] },
  { iso2: 'JM', name: 'Jamaica', dialCode: '+1876', nationalNumberLengths: [10] },
  { iso2: 'JP', name: 'Japan', dialCode: '+81', nationalNumberLengths: [10] },
  { iso2: 'JE', name: 'Jersey', dialCode: '+44', nationalNumberLengths: [10] },
  { iso2: 'JO', name: 'Jordan', dialCode: '+962', nationalNumberLengths: [9] },
  { iso2: 'KZ', name: 'Kazakhstan', dialCode: '+7', nationalNumberLengths: [10] },
  { iso2: 'KE', name: 'Kenya', dialCode: '+254', nationalNumberLengths: [9] },
  { iso2: 'KI', name: 'Kiribati', dialCode: '+686', nationalNumberLengths: [5, 8] },
  { iso2: 'XK', name: 'Kosovo', dialCode: '+383', nationalNumberLengths: [8] },
  { iso2: 'KW', name: 'Kuwait', dialCode: '+965', nationalNumberLengths: [8] },
  { iso2: 'KG', name: 'Kyrgyzstan', dialCode: '+996', nationalNumberLengths: [9] },
  { iso2: 'LA', name: 'Laos', dialCode: '+856', nationalNumberLengths: [8, 9] },
  { iso2: 'LV', name: 'Latvia', dialCode: '+371', nationalNumberLengths: [8] },
  { iso2: 'LB', name: 'Lebanon', dialCode: '+961', nationalNumberLengths: [7, 8] },
  { iso2: 'LS', name: 'Lesotho', dialCode: '+266', nationalNumberLengths: [8] },
  { iso2: 'LR', name: 'Liberia', dialCode: '+231', nationalNumberLengths: [7, 8] },
  { iso2: 'LY', name: 'Libya', dialCode: '+218', nationalNumberLengths: [9] },
  { iso2: 'LI', name: 'Liechtenstein', dialCode: '+423', nationalNumberLengths: [7] },
  { iso2: 'LT', name: 'Lithuania', dialCode: '+370', nationalNumberLengths: [8] },
  { iso2: 'LU', name: 'Luxembourg', dialCode: '+352', nationalNumberLengths: [9] },
  { iso2: 'MO', name: 'Macau', dialCode: '+853', nationalNumberLengths: [8] },
  { iso2: 'MG', name: 'Madagascar', dialCode: '+261', nationalNumberLengths: [9] },
  { iso2: 'MW', name: 'Malawi', dialCode: '+265', nationalNumberLengths: [9] },
  { iso2: 'MY', name: 'Malaysia', dialCode: '+60', nationalNumberLengths: [9, 10] },
  { iso2: 'MV', name: 'Maldives', dialCode: '+960', nationalNumberLengths: [7] },
  { iso2: 'ML', name: 'Mali', dialCode: '+223', nationalNumberLengths: [8] },
  { iso2: 'MT', name: 'Malta', dialCode: '+356', nationalNumberLengths: [8] },
  { iso2: 'MH', name: 'Marshall Islands', dialCode: '+692', nationalNumberLengths: [7] },
  { iso2: 'MQ', name: 'Martinique', dialCode: '+596', nationalNumberLengths: [9] },
  { iso2: 'MR', name: 'Mauritania', dialCode: '+222', nationalNumberLengths: [8] },
  { iso2: 'MU', name: 'Mauritius', dialCode: '+230', nationalNumberLengths: [7, 8] },
  { iso2: 'YT', name: 'Mayotte', dialCode: '+262', nationalNumberLengths: [9] },
  { iso2: 'MX', name: 'Mexico', dialCode: '+52', nationalNumberLengths: [10] },
  { iso2: 'FM', name: 'Micronesia', dialCode: '+691', nationalNumberLengths: [7] },
  { iso2: 'MD', name: 'Moldova', dialCode: '+373', nationalNumberLengths: [8] },
  { iso2: 'MC', name: 'Monaco', dialCode: '+377', nationalNumberLengths: [8, 9] },
  { iso2: 'MN', name: 'Mongolia', dialCode: '+976', nationalNumberLengths: [8] },
  { iso2: 'ME', name: 'Montenegro', dialCode: '+382', nationalNumberLengths: [8] },
  { iso2: 'MS', name: 'Montserrat', dialCode: '+1664', nationalNumberLengths: [10] },
  { iso2: 'MA', name: 'Morocco', dialCode: '+212', nationalNumberLengths: [9] },
  { iso2: 'MZ', name: 'Mozambique', dialCode: '+258', nationalNumberLengths: [9] },
  { iso2: 'MM', name: 'Myanmar', dialCode: '+95', nationalNumberLengths: [8, 9, 10] },
  { iso2: 'NA', name: 'Namibia', dialCode: '+264', nationalNumberLengths: [9] },
  { iso2: 'NR', name: 'Nauru', dialCode: '+674', nationalNumberLengths: [7] },
  { iso2: 'NP', name: 'Nepal', dialCode: '+977', nationalNumberLengths: [10] },
  { iso2: 'NL', name: 'Netherlands', dialCode: '+31', nationalNumberLengths: [9] },
  { iso2: 'NC', name: 'New Caledonia', dialCode: '+687', nationalNumberLengths: [6] },
  { iso2: 'NZ', name: 'New Zealand', dialCode: '+64', nationalNumberLengths: [8, 9, 10] },
  { iso2: 'NI', name: 'Nicaragua', dialCode: '+505', nationalNumberLengths: [8] },
  { iso2: 'NE', name: 'Niger', dialCode: '+227', nationalNumberLengths: [8] },
  { iso2: 'NG', name: 'Nigeria', dialCode: '+234', nationalNumberLengths: [10] },
  { iso2: 'NU', name: 'Niue', dialCode: '+683', nationalNumberLengths: [4] },
  { iso2: 'NF', name: 'Norfolk Island', dialCode: '+672', nationalNumberLengths: [6] },
  { iso2: 'KP', name: 'North Korea', dialCode: '+850', nationalNumberLengths: [10] },
  { iso2: 'MK', name: 'North Macedonia', dialCode: '+389', nationalNumberLengths: [8] },
  { iso2: 'MP', name: 'Northern Mariana Islands', dialCode: '+1670', nationalNumberLengths: [10] },
  { iso2: 'NO', name: 'Norway', dialCode: '+47', nationalNumberLengths: [8] },
  { iso2: 'OM', name: 'Oman', dialCode: '+968', nationalNumberLengths: [8] },
  { iso2: 'PK', name: 'Pakistan', dialCode: '+92', nationalNumberLengths: [10] },
  { iso2: 'PW', name: 'Palau', dialCode: '+680', nationalNumberLengths: [7] },
  { iso2: 'PS', name: 'Palestine', dialCode: '+970', nationalNumberLengths: [9] },
  { iso2: 'PA', name: 'Panama', dialCode: '+507', nationalNumberLengths: [8] },
  { iso2: 'PG', name: 'Papua New Guinea', dialCode: '+675', nationalNumberLengths: [8] },
  { iso2: 'PY', name: 'Paraguay', dialCode: '+595', nationalNumberLengths: [9] },
  { iso2: 'PE', name: 'Peru', dialCode: '+51', nationalNumberLengths: [9] },
  { iso2: 'PH', name: 'Philippines', dialCode: '+63', nationalNumberLengths: [10] },
  { iso2: 'PL', name: 'Poland', dialCode: '+48', nationalNumberLengths: [9] },
  { iso2: 'PT', name: 'Portugal', dialCode: '+351', nationalNumberLengths: [9] },
  { iso2: 'PR', name: 'Puerto Rico', dialCode: '+1787', nationalNumberLengths: [10] },
  { iso2: 'PR', name: 'Puerto Rico', dialCode: '+1939', nationalNumberLengths: [10] },
  { iso2: 'QA', name: 'Qatar', dialCode: '+974', nationalNumberLengths: [8] },
  { iso2: 'RE', name: 'Reunion', dialCode: '+262', nationalNumberLengths: [9] },
  { iso2: 'RO', name: 'Romania', dialCode: '+40', nationalNumberLengths: [9] },
  { iso2: 'RU', name: 'Russia', dialCode: '+7', nationalNumberLengths: [10] },
  { iso2: 'RW', name: 'Rwanda', dialCode: '+250', nationalNumberLengths: [9] },
  { iso2: 'BL', name: 'Saint Barthelemy', dialCode: '+590', nationalNumberLengths: [9] },
  { iso2: 'SH', name: 'Saint Helena', dialCode: '+290', nationalNumberLengths: [4] },
  { iso2: 'KN', name: 'Saint Kitts and Nevis', dialCode: '+1869', nationalNumberLengths: [10] },
  { iso2: 'LC', name: 'Saint Lucia', dialCode: '+1758', nationalNumberLengths: [10] },
  { iso2: 'MF', name: 'Saint Martin', dialCode: '+590', nationalNumberLengths: [9] },
  { iso2: 'PM', name: 'Saint Pierre and Miquelon', dialCode: '+508', nationalNumberLengths: [6] },
  { iso2: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '+1784', nationalNumberLengths: [10] },
  { iso2: 'WS', name: 'Samoa', dialCode: '+685', nationalNumberLengths: [7] },
  { iso2: 'SM', name: 'San Marino', dialCode: '+378', nationalNumberLengths: [10] },
  { iso2: 'ST', name: 'Sao Tome and Principe', dialCode: '+239', nationalNumberLengths: [7] },
  { iso2: 'SA', name: 'Saudi Arabia', dialCode: '+966', nationalNumberLengths: [9] },
  { iso2: 'SN', name: 'Senegal', dialCode: '+221', nationalNumberLengths: [9] },
  { iso2: 'RS', name: 'Serbia', dialCode: '+381', nationalNumberLengths: [8, 9] },
  { iso2: 'SC', name: 'Seychelles', dialCode: '+248', nationalNumberLengths: [7] },
  { iso2: 'SL', name: 'Sierra Leone', dialCode: '+232', nationalNumberLengths: [8] },
  { iso2: 'SG', name: 'Singapore', dialCode: '+65', nationalNumberLengths: [8] },
  { iso2: 'SX', name: 'Sint Maarten', dialCode: '+1721', nationalNumberLengths: [10] },
  { iso2: 'SK', name: 'Slovakia', dialCode: '+421', nationalNumberLengths: [9] },
  { iso2: 'SI', name: 'Slovenia', dialCode: '+386', nationalNumberLengths: [8] },
  { iso2: 'SB', name: 'Solomon Islands', dialCode: '+677', nationalNumberLengths: [5, 7] },
  { iso2: 'SO', name: 'Somalia', dialCode: '+252', nationalNumberLengths: [8, 9] },
  { iso2: 'ZA', name: 'South Africa', dialCode: '+27', nationalNumberLengths: [9] },
  { iso2: 'KR', name: 'South Korea', dialCode: '+82', nationalNumberLengths: [9, 10] },
  { iso2: 'SS', name: 'South Sudan', dialCode: '+211', nationalNumberLengths: [9] },
  { iso2: 'ES', name: 'Spain', dialCode: '+34', nationalNumberLengths: [9] },
  { iso2: 'LK', name: 'Sri Lanka', dialCode: '+94', nationalNumberLengths: [9] },
  { iso2: 'SD', name: 'Sudan', dialCode: '+249', nationalNumberLengths: [9] },
  { iso2: 'SR', name: 'Suriname', dialCode: '+597', nationalNumberLengths: [6, 7] },
  { iso2: 'SJ', name: 'Svalbard and Jan Mayen', dialCode: '+47', nationalNumberLengths: [8] },
  { iso2: 'SE', name: 'Sweden', dialCode: '+46', nationalNumberLengths: [9] },
  { iso2: 'CH', name: 'Switzerland', dialCode: '+41', nationalNumberLengths: [9] },
  { iso2: 'SY', name: 'Syria', dialCode: '+963', nationalNumberLengths: [9] },
  { iso2: 'TW', name: 'Taiwan', dialCode: '+886', nationalNumberLengths: [9] },
  { iso2: 'TJ', name: 'Tajikistan', dialCode: '+992', nationalNumberLengths: [9] },
  { iso2: 'TZ', name: 'Tanzania', dialCode: '+255', nationalNumberLengths: [9] },
  { iso2: 'TH', name: 'Thailand', dialCode: '+66', nationalNumberLengths: [9] },
  { iso2: 'TL', name: 'Timor-Leste', dialCode: '+670', nationalNumberLengths: [7, 8] },
  { iso2: 'TG', name: 'Togo', dialCode: '+228', nationalNumberLengths: [8] },
  { iso2: 'TK', name: 'Tokelau', dialCode: '+690', nationalNumberLengths: [4] },
  { iso2: 'TO', name: 'Tonga', dialCode: '+676', nationalNumberLengths: [5, 7] },
  { iso2: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', nationalNumberLengths: [10] },
  { iso2: 'TN', name: 'Tunisia', dialCode: '+216', nationalNumberLengths: [8] },
  { iso2: 'TR', name: 'Turkey', dialCode: '+90', nationalNumberLengths: [10] },
  { iso2: 'TM', name: 'Turkmenistan', dialCode: '+993', nationalNumberLengths: [8] },
  { iso2: 'TC', name: 'Turks and Caicos Islands', dialCode: '+1649', nationalNumberLengths: [10] },
  { iso2: 'TV', name: 'Tuvalu', dialCode: '+688', nationalNumberLengths: [5, 6] },
  { iso2: 'VI', name: 'US Virgin Islands', dialCode: '+1340', nationalNumberLengths: [10] },
  { iso2: 'UG', name: 'Uganda', dialCode: '+256', nationalNumberLengths: [9] },
  { iso2: 'UA', name: 'Ukraine', dialCode: '+380', nationalNumberLengths: [9] },
  { iso2: 'AE', name: 'United Arab Emirates', dialCode: '+971', nationalNumberLengths: [9] },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '+44', nationalNumberLengths: [10] },
  { iso2: 'US', name: 'United States', dialCode: '+1', nationalNumberLengths: [10] },
  { iso2: 'UY', name: 'Uruguay', dialCode: '+598', nationalNumberLengths: [8] },
  { iso2: 'UZ', name: 'Uzbekistan', dialCode: '+998', nationalNumberLengths: [9] },
  { iso2: 'VU', name: 'Vanuatu', dialCode: '+678', nationalNumberLengths: [5, 7] },
  { iso2: 'VA', name: 'Vatican City', dialCode: '+39', nationalNumberLengths: [9, 10] },
  { iso2: 'VE', name: 'Venezuela', dialCode: '+58', nationalNumberLengths: [10] },
  { iso2: 'VN', name: 'Vietnam', dialCode: '+84', nationalNumberLengths: [9] },
  { iso2: 'WF', name: 'Wallis and Futuna', dialCode: '+681', nationalNumberLengths: [6] },
  { iso2: 'EH', name: 'Western Sahara', dialCode: '+212', nationalNumberLengths: [9] },
  { iso2: 'YE', name: 'Yemen', dialCode: '+967', nationalNumberLengths: [9] },
  { iso2: 'ZM', name: 'Zambia', dialCode: '+260', nationalNumberLengths: [9] },
  { iso2: 'ZW', name: 'Zimbabwe', dialCode: '+263', nationalNumberLengths: [9] },
]

export const DEFAULT_PHONE_COUNTRY =
  PHONE_COUNTRIES.find((c) => c.iso2 === 'IN') ?? PHONE_COUNTRIES[0]

export function getCountryFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

const SHARED_DIAL_CODE_PRIMARY_ISO: Record<string, string> = {
  '+1': 'US', '+7': 'RU', '+39': 'IT', '+44': 'GB', '+47': 'NO',
  '+61': 'AU', '+212': 'MA', '+262': 'RE', '+358': 'FI', '+590': 'GP', '+599': 'CW',
}

export function splitPhoneNumber(value: string): { country: PhoneCountry; nationalNumber: string } {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (!trimmed.startsWith('+')) return { country: DEFAULT_PHONE_COUNTRY, nationalNumber: digits }

  const matches = PHONE_COUNTRIES
    .filter((c) => trimmed.startsWith(c.dialCode))
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
  const longest = matches[0]?.dialCode
  const country =
    matches.find((c) => c.dialCode === longest && c.iso2 === SHARED_DIAL_CODE_PRIMARY_ISO[c.dialCode]) ??
    matches[0] ??
    DEFAULT_PHONE_COUNTRY

  const dialDigits = country.dialCode.replace(/\D/g, '')
  const nationalNumber = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits
  return { country, nationalNumber }
}

export function formatPhoneForStorage(value: string, country = DEFAULT_PHONE_COUNTRY): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('+')) {
    const { country: parsed, nationalNumber } = splitPhoneNumber(trimmed)
    return `${parsed.dialCode}${nationalNumber}`
  }
  return `${country.dialCode}${trimmed.replace(/\D/g, '')}`
}

export function validatePhoneNumber(value: string): string | null {
  if (!value.trim()) return 'Phone number is required'
  const normalised = formatPhoneForStorage(value)
  const { country, nationalNumber } = splitPhoneNumber(normalised)
  if (!nationalNumber) return 'Phone number is required'
  if (!/^\d+$/.test(nationalNumber)) return 'Enter digits only'
  if (normalised.replace(/\D/g, '').length > 15) return 'Enter a valid international phone number'
  if (country.nationalNumberLengths?.length) {
    if (!country.nationalNumberLengths.includes(nationalNumber.length)) {
      return `Enter a valid ${country.nationalNumberLengths.join(' or ')}-digit number for ${country.name}`
    }
  } else if (nationalNumber.length < 4 || nationalNumber.length > 14) {
    return 'Enter a valid international phone number'
  }
  if (country.nationalNumberPattern && !country.nationalNumberPattern.test(nationalNumber)) {
    return `Enter a valid phone number for ${country.name}`
  }
  return null
}
