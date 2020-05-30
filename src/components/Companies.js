import React from 'react';

const Companies = (props) => {
    const { companies, following, update } = props;
    const followingIds = following.map(follow => follow.companyId);
    const rating = (company) => {
        if (following.filter(follow => follow.companyId === company.id).length) {
            return following.filter(follow => follow.companyId === company.id)
                .map(follow => follow.rating).join('');
        } else {
            return 0
        }
    }

    return (
        <ul style={{
            listStyle: 'none',
            padding: 0
        }}>
            {
                companies.map(company => {

                    return (
                        <div key={company.id}
                            style={{
                                backgroundColor: followingIds.includes(company.id) ? 'tomato' : 'mistyrose',
                                padding: '1em',
                                margin: '0.5em 0'
                            }}>
                            <li style={{
                                margin: '.5em 0'
                            }}>
                                {company.name}
                            </li>
                            <select
                                name={'rating'}
                                value={rating(company)}
                                onChange={(e) => update(e.target.value, company.id)}
                                style={{ width: '200px' }}
                            >

                                <option value={5}>5</option>
                                <option value={4}>4</option>
                                <option value={3}>3</option>
                                <option value={2}>2</option>
                                <option value={1}>1</option>
                                <option value={0}>{`${followingIds.includes(company.id) ? 'Unfollow' : 'Rate and Follow'}`}</option>
                            </select>
                        </div>
                    )
                })
            }
        </ul>
    );
    Í
}

export default Companies;

{

}